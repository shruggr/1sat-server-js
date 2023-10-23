import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";
import { Claim, Txo } from '../models/txo';
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

    @Get("count")
    public async getCount(): Promise<{count: number}> {
        const { rows: [{count}] } = await pool.query(`SELECT MAX(num) as count FROM origins`);
        return {count};
    }

    @Get("num/{num}")
    public async getLatestByOrigin(
        @Path() num: number,
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const {rows: [lastest]} = await pool.query(`
            SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE n.num = $1 AND t.spend = '\\x'
            ORDER BY t.height DESC, t.idx DESC`,
            [num]
        );

        return Txo.fromRow(lastest);
    }
}