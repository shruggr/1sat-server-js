import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";
import { Outpoint } from '../models/outpoint';

export interface OpnsResponse {
    outpoint: Outpoint;
    origin: Outpoint;
    domain: string;
    map?: { [key: string]: any };
}

@Route("api/opns")
export class OpnsController extends Controller {
    @Get("{domain}")
    public async getOpns(
        @Path() domain: string,
    ): Promise<OpnsResponse> {
        const query = `SELECT t.outpoint, t.origin, o.data->'opns'->>'domain' as domain, m.map
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            LEFT JOIN origins m ON m.origin = t.origin
            WHERE t.spend = '\\x' AND o.data @> $1`;
        const {rows: [opns]} = await pool.query(
            query,
            [JSON.stringify({opns: {domain, status:1}})]
        );
        if (!opns) {
            throw new NotFound();
        }
        return {
            outpoint: Outpoint.fromBuffer(opns.outpoint),
            origin: Outpoint.fromBuffer(opns.origin),
            domain: opns.domain,
            map: opns.map,
        };
    }
}