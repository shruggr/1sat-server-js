import { Controller, Get, Path, Query, Route } from "tsoa";
import { Inscription } from "../models/inscription";
import { pool } from "../db";

@Route("api/collections")
export class CollectionsController extends Controller {
    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const rows = await pool.query(`SELECT * FROM inscriptions 
            WHERE map @> '{"subType": "collection"}'::jsonb
            ORDER BY height DESC, idx DESC
            LIMIT $1 OFFSET $2`, 
            [limit, offset]
        )

        return rows.rows.map(row => Inscription.fromRow(row));
    }

    @Get("{collectionId}/items")
    public async getCollectionItems(
        @Path() collectionId: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const rows = await pool.query(`SELECT * FROM inscriptions 
            WHERE map @> '{"type": "collectionItem", "collectionId": $1}'::jsonb
            ORDER BY height DESC, idx DESC
            LIMIT $2 OFFSET $3`, 
            [collectionId, limit, offset]
        )

        return rows.rows.map(row => Inscription.fromRow(row));
    }
}