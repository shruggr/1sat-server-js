import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { cache, pool } from "../db";
import { Utils } from '@bsv/sdk';


@Route("api/collections")
export class CollectionsController extends Controller {
    @Get("{collectionId}/stats")
    public async getCollection(
        @Path() collectionId: string,
    ): Promise<{ count: number, max: number }> {
        const cacheKey = `stats:${collectionId}`;
        const cached = await cache.get(cacheKey);
        if(cached) {
            return JSON.parse(cached);
        }
        const { rows: [row] } = await pool.query(`
        SELECT MAX((data->'map'->'subTypeData'->>'mintNumber')::BIGINT) as maxnum, 
        COUNT(1)::INTEGER as count
        FROM txos
        WHERE data @> $1`,
            [JSON.stringify({ map: { subTypeData: { collectionId } } })],
        )

        this.setHeader('Cache-Control', 'max-age=600')
        if (!row) throw new NotFound();
        const value = { count: row.count, max: row.maxnum };
        await cache.set(cacheKey, JSON.stringify(value), 'EX', 600);
        return value;
    }

    @Get("{collectionId}/holders")
    public async getCollectionHolders(
        @Path() collectionId: string,
    ): Promise<{ address: string, amt: string }[]> {
        // const cacheKey = `coll:${collectionId}:holders`

        // this.setHeader('Cache-Control', 'max-age=3600')
        // const status = await cache.get(cacheKey);
        // if (status) {
        //     return JSON.parse(status).slice(0, limit);
        // }

        const { rows } = await pool.query(`
            SELECT t.pkhash, COUNT(1) as amt
            FROM txos t
            LEFT JOIN txos o ON o.outpoint = t.origin
            WHERE o.data @> $1 AND t.spend='\\x'
            GROUP BY t.pkhash
            ORDER BY amt DESC`,
            [JSON.stringify({ map: { subTypeData: { collectionId } } })],
        )

        // const { rows } = await pool.query(`
        //     SELECT pkhash, SUM(amt) as amt
        //     FROM bsv20_txos
        //     WHERE tick=$1 AND status=1 AND spend='\\x' and pkhash != '\\x'
        //     GROUP BY pkhash
        //     ORDER BY amt DESC`,
        //     [tick],
        // );
        const tokens = rows.map(r => ({
            address: Utils.toBase58Check([...r.pkhash]),
            amt: r.amt,
        }))
        // await cache.set(cacheKey, JSON.stringify(tokens), 'EX', 60);
        return tokens;
    }
}