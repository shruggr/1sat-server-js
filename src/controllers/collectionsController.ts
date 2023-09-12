import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
// import { Inscription } from "../models/inscription";
import { pool } from "../db";

@Route("api/collections")
export class CollectionsController extends Controller {
    // @Get("recent")
    // public async getRecentListings(
    //     @Query() limit: number = 100,
    //     @Query() offset: number = 0
    // ): Promise<Inscription[]> {
    //     this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    //     const {rows} = await pool.query(`SELECT * FROM inscriptions 
    //         WHERE map @> '{"subType": "collection"}'::jsonb
    //         ORDER BY height DESC, idx DESC
    //         LIMIT $1 OFFSET $2`,
    //         [limit, offset]
    //     )

    //     return rows.map(row => Inscription.fromRow(row));
    // }
    
    // @Get("sigma/{address}")
    // public async searchSigmaCollections(
    //     @Path() address: string,
    //     @Query() limit: number = 100,
    //     @Query() offset: number = 0
    // ): Promise<Inscription[]> {
    //     const {rows} = await pool.query(`SELECT * FROM inscriptions
    //         WHERE sigma @> $1 AND map @> '{"subType": "collection"}'::jsonb
    //         ORDER BY height DESC, idx DESC
    //         LIMIT $2 OFFSET $3`,
    //         [JSON.stringify([{
    //             address,
    //             valid: true
    //         }]) , limit, offset]
    //     )
    //     return rows.map(row => Inscription.fromRow(row));
    // }

    @Get("{collectionId}/stats")
    public async getCollection(
        @Path() collectionId: string,
    ): Promise<{count: number, max: number}> {
        const { rows: [row]} = await pool.query(`
            SELECT MAX((data->'map'->'subTypeData'->>'mintNumber')::INTEGER) as maxNum, 
            COUNT(1)::INTEGER as count
            FROM txos
            WHERE map @> $1`, 
            [JSON.stringify({map: {subTypeData: {collectionId}}})],
        )

        if (!row) throw new NotFound();
        return row
    }

    // @Get("{collectionId}/items")
    // public async getCollectionItems(
    //     @Path() collectionId: string,
    //     @Query() limit: number = 100,
    //     @Query() offset: number = 0
    // ): Promise<Inscription[]> {
    //     this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    //     const {rows} = await pool.query(`SELECT * FROM inscriptions 
    //         WHERE map @> $1::jsonb
    //         ORDER BY height DESC, idx DESC
    //         LIMIT $2 OFFSET $3`,
    //         [
    //             JSON.stringify({
    //                 type: 'ord',
    //                 subType: 'collectionItem',
    //                 subTypeData: { collectionId }
    //             }),
    //             limit,
    //             offset
    //         ]
    //     )

    //     return rows.map(row => Inscription.fromRow(row));
    // }
}