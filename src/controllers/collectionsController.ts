import { NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { Inscription, Sigma } from "../models/inscription";
import { pool } from "../db";
import { Outpoint } from '../models/outpoint';

@Route("api/collections")
export class CollectionsController extends Controller {
    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const {rows} = await pool.query(`SELECT * FROM inscriptions 
            WHERE map @> '{"subType": "collection"}'::jsonb
            ORDER BY height DESC, idx DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        )

        return rows.map(row => Inscription.fromRow(row));
    }
    
    @Get("sigma/{address}")
    public async searchSigmaCollections(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        const {rows} = await pool.query(`SELECT * FROM inscriptions
            WHERE sigma @> $1 AND map @> '{"subType": "collection"}'::jsonb
            ORDER BY height DESC, idx DESC
            LIMIT $2 OFFSET $3`,
            [JSON.stringify([{
                address,
                valid: true
            }]) , limit, offset]
        )
        return rows.map(row => Inscription.fromRow(row));
    }

    @Get("{collectionId}/stats")
    public async getCollection(
        @Path() collectionId: string,
    ): Promise<{count: number, highestMintNum: number, MAP?: {[key: string]: any}, SIGMA?: Sigma[]}> {
        const outpoint =Outpoint.fromString(collectionId);
        const { rows: [row]} = await pool.query(`SELECT MAX((map->'subTypeData'->>'mintNumber')::INTEGER) as maxnum, COUNT(1)::INTEGER as count
            FROM inscriptions
            WHERE map @> $1`, 
            [JSON.stringify({subTypeData: {collectionId}})],
        )

        if (!row) throw new NotFound();

        const { rows: [ins]} = await pool.query(`SELECT map, sigma
            FROM inscriptions
            WHERE txid=$1 AND vout=$2`,
            [outpoint.txid, outpoint.vout],
        )
        return {
            count: row.count,
            highestMintNum: row.maxnum || 0,
            MAP: ins?.map,
            SIGMA: ins.sigma,
        }
    }

    @Get("{collectionId}/items")
    public async getCollectionItems(
        @Path() collectionId: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const {rows} = await pool.query(`SELECT * FROM inscriptions 
            WHERE map @> $1::jsonb
            ORDER BY height DESC, idx DESC
            LIMIT $2 OFFSET $3`,
            [
                JSON.stringify({
                    type: 'ord',
                    subType: 'collectionItem',
                    subTypeData: { collectionId }
                }),
                limit,
                offset
            ]
        )

        return rows.map(row => Inscription.fromRow(row));
    }
}