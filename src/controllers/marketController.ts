import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { pool } from "../db";
import { Txo } from "../models/txo";
import { SortDirection } from "../models/sort-direction";

export enum ListingSort {
    recent = 'recent',
    num = 'num',
    price = 'price',
}

export class MarketSearch {
    bsv20 = false
    sort: ListingSort = ListingSort.recent
    dir: SortDirection = SortDirection.desc
    type?: string
    data?: {[key:string]:any}
    text = ''
    minPrice?: number
    maxPrice?: number
    limit: number = 100
    offset: number = 0
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
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let data: {[key: string]: any} | undefined;
        if (q) {
            data = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchListings({bsv20, sort, dir, type, data, text, minPrice, maxPrice, limit, offset});
    }

    @Post("")
    public async searchMap(
        @Body() data?: {[key: string]: any},
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() bsv20 = false,
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchListings({bsv20, sort, dir, type, data, text, minPrice, maxPrice, limit, offset});
    }

    public async searchListings(search: MarketSearch): Promise<Txo[]> {
        const { bsv20, sort, dir, type, data, text, minPrice, maxPrice, limit, offset } = search;
        const params: any[] = [bsv20];
        let sql = [`SELECT t.*, o.data as odata, n.num
            FROM listings l
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin
            WHERE l.spend = '\\x' AND l.bsv20 = $1`];

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

        if (minPrice) {
            params.push(minPrice);
            sql.push(`AND l.price >= $${params.length}`)
        }

        if (maxPrice) {
            params.push(maxPrice);
            sql.push(`AND l.price <= $${params.length}`)
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
        
        // console.log(sql, params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }


}