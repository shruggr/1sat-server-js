import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";

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
}