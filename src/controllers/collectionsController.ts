import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";
import { Address } from '@ts-bitcoin/core';

@Route("api/collections")
export class CollectionsController extends Controller {
    @Get("{collectionId}/stats")
    public async getCollection(
        @Path() collectionId: string,
    ): Promise<{count: number, max: number}> {
        const { rows: [row]} = await pool.query(`
            SELECT MAX((data->'map'->'subTypeData'->>'mintNumber')::BIGINT) as maxnum, 
            COUNT(1)::INTEGER as count
            FROM txos
            WHERE data @> $1`, 
            [JSON.stringify({map: {subTypeData: {collectionId}}})],
        )

        if (!row) throw new NotFound();
        return {count: row.count, max: row.maxnum};
    }

    @Get("{collectionId}/holders")
    public async getCollectionHolders(
        @Path() collectionId: string,
    ): Promise<{ address: string, amt: string }[]> {
        // const cacheKey = `coll:${collectionId}:holders`

        // this.setHeader('Cache-Control', 'max-age=3600')
        // const status = await redis.get(cacheKey);
        // if (status) {
        //     return JSON.parse(status).slice(0, limit);
        // }

        const { rows} = await pool.query(`
            SELECT t.pkhash, COUNT(1) as amt
            FROM txos t
            LEFT JOIN txos o ON o.outpoint = t.origin
            WHERE o.data @> $1
            GROUP BY t.pkhash
            ORDER BY amt DESC`,
            [JSON.stringify({map: {subTypeData: {collectionId}}})],
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
            address: Address.fromPubKeyHashBuf(r.pkhash).toString(),
            amt: r.amt,
        }))
        // await redis.set(cacheKey, JSON.stringify(tokens), 'EX', 60);
        return tokens;
    }
}