import { NotFound } from 'http-errors';
import { Controller, Deprecated, Get, Path, Query, Route } from "tsoa";
import { Inscription, Sigma } from "../models/inscription";
import { pool } from "../db";
import { Outpoint } from '../models/outpoint';

@Route("api/collections")
export class CollectionsController extends Controller {
    @Get("")
    public async getCollections(
        @Query() search: string = '',
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let where = `WHERE map @> '{"subType": "collection"}'::jsonb `;
        const params: any[] = [limit, offset];
        if(search != "") {
            where += "AND search_text_en @@ plainto_tsquery('english', $3)";
            params.push(search);
        }
        const {rows} = await pool.query(`SELECT * FROM inscriptions 
            ${where}
            ORDER BY height DESC, idx DESC
            LIMIT $1 OFFSET $2`,
            params,
        )

        return rows.map(row => Inscription.fromRow(row));
    }

    @Deprecated()
    @Get("recent")
    public async getRecentCollections(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        return this.getCollections('', limit, offset)
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

        const params: any[] = [JSON.stringify({
            type: 'ord',
            subType: 'collectionItem',
            subTypeData: { collectionId }
        })];
        const where = `i.map @> $1::jsonb AND t.spend='\\x'`
        const orderBy = 'height DESC, idx DESC'
        return Inscription.loadInscriptions(params, where, orderBy, limit, offset)
        // const {rows} = await pool.query(`SELECT * FROM inscriptions 
        //     WHERE map @> $1::jsonb
        //     ORDER BY height DESC, idx DESC
        //     LIMIT $2 OFFSET $3`,
        //     [
        //         ,
        //         limit,
        //         offset =
        //     ]
        // )

        // return rows.map(row => Inscription.fromRow(row));
    }
}