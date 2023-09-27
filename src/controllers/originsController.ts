import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";
import { Claim } from '../models/txo';
import { Outpoint } from '../models/outpoint';

@Route("api/origins")
export class OriginsController extends Controller {
    @Get("{origin}/claims")
    public async getClaims(
        @Path() origin: string,
    ): Promise<Claim[]> {
        const { rows } = await pool.query(`
            SELECT t.data->'claims' as oclaims
            FROM txos t
            WHERE origin = $1 AND data->'claims' IS NOT NULL`, 
            [Outpoint.fromString(origin).toBuffer()],
        )

        const claims: Claim[] = [];
        rows.forEach(({oclaims}) => claims.push(...oclaims))
        return claims;
    }
}