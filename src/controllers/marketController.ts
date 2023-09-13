import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { pool } from "../db";
import { Txo } from "../models/txo";
import { SortDirection } from "../models/sort-direction";

export enum ListingSort {
    recent = 'recent',
    num = 'num',
    price = 'price',
}

@Route("api/market")
export class MarketController extends Controller {
    @Get("")
    public async getOpenListings(
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() bsv20 = false,
        @Query() text = ''
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: {[key: string]: any} | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchListings(bsv20, sort, dir, type, query, text, limit, offset);
    }

    @Post("")
    public async searchMap(
        @Body() map?: {[key: string]: any},
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() bsv20 = false,
        @Query() text = ''
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchListings(bsv20, sort, dir, type, map, text, limit, offset);
    }

    public async searchListings(bsv20: boolean, sort: ListingSort, dir: SortDirection, type?: string, data?: {[key:string]:any}, text = '', limit: number = 100, offset: number = 0): Promise<Txo[]> {
        const params: any[] = [bsv20];
        let sql = [`SELECT t.*, o.data as odata, o.num
            FROM listings l
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            JOIN origins o ON o.origin = t.origin
            WHERE l.spend = '\\x' and l.bsv20 = $1`];

        if(type) {
            params.push(`${type}%`);
            sql.push(`AND l.filetype like $${params.length}`)
        }

        if(data) {
            params.push(data);
            sql.push(`AND l.data @> $${params.length}`)
        }

        if(text) {
            params.push(text);
            sql.push(`AND l.search_text_en @@ plainto_tsquery('english', $${params.length})`)
        }

        switch(sort) {
            case ListingSort.num:
                sql.push(`ORDER BY l.num ${dir}`);
                break;
            case ListingSort.price:
                sql.push(`ORDER BY l.price ${dir}`);
                break;
            default:
                sql.push(`ORDER BY l.height ${dir}, l.idx ${dir}`);
        }

        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)
        
        console.log(sql, params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }


}