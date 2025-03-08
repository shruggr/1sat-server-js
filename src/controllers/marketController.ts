import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { pool } from "../db";
import { Txo } from "../models/txo";
import { SortDirection } from "../models/sort-direction";
import { Address } from "@ts-bitcoin/core";

export enum ListingSort {
    recent = 'recent',
    price = 'price',
    num = 'num'
}

export class MarketSearch {
    sort: ListingSort = ListingSort.recent
    dir: SortDirection = SortDirection.desc
    type?: string
    data?: {[key:string]:any}
    text = ''
    minPrice?: number
    maxPrice?: number
    limit: number = 100
    offset: number = 0
    address?: string 
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
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
        @Query() address?: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let data: {[key: string]: any} | undefined;
        if (q) {
            data = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchListings({sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address});
    }

    @Post("")
    public async postMarketSearch(
        @Body() data?: {[key: string]: any},
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
        @Query() address?: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchListings({sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address});
    }

    public async searchListings(search: MarketSearch): Promise<Txo[]> {
        const { sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address } = search;
        const params: any[] = [];

        // let sql = [`SELECT t.*, l.data as odata, l.oheight, l.oidx, l.sale
        //     FROM listings l
        //     JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
        //     WHERE l.spend = '\\x'`];

        let sql = [`SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout, l.sale
            FROM listings l
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            JOIN txos o ON o.outpoint = t.origin
            WHERE l.spend = '\\x'`];

        if(type) {
            params.push(`${type}%`);
            sql.push(`AND l.filetype like $${params.length}`)
        }

        if(data) {
            params.push(data);
            sql.push(`AND l.data @> $${params.length}`)
        }

        if (address) {
            const add = Address.fromString(address);
            params.push(add.hashBuf);
            sql.push(`AND l.pkhash = $${params.length}`)
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
            case ListingSort.price:
                sql.push(`ORDER BY l.price ${dir}`);
                break;
            case ListingSort.num:
                sql.push(`ORDER BY l.oheight ${dir}, l.oidx ${dir}`);
            default:
                sql.push(`ORDER BY l.height ${dir}, l.idx ${dir}`);
        }

        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)
        
        // console.log(sql.join(' '), params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("sales")
    public async getMarketSales(
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
        @Query() address?: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let data: {[key: string]: any} | undefined;
        if (q) {
            data = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchSales({sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address});
    }

    @Post("sales")
    public async postMarketSalesSearch(
        @Body() data?: {[key: string]: any},
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type?: string,
        @Query() text = '',
        @Query() minPrice?: number,
        @Query() maxPrice?: number,
        @Query() address?: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchSales({sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address});
    }

    public async searchSales(search: MarketSearch): Promise<Txo[]> {
        const { sort, dir, type, data, text, minPrice, maxPrice, limit, offset, address } = search;
        const params: any[] = [];

        let sql = [`SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout, l.sale
            FROM listings l
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            JOIN txos o ON o.outpoint = t.origin
            WHERE l.spend != '\\x' AND l.sale = true`];

        if(type) {
            params.push(`${type}%`);
            sql.push(`AND l.filetype like $${params.length}`)
        }

        if(data) {
            params.push(data);
            sql.push(`AND l.data @> $${params.length}`)
        }

        if (address) {
            const add = Address.fromString(address);
            params.push(add.hashBuf);
            sql.push(`AND l.pkhash = $${params.length}`)
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
            case ListingSort.price:
                sql.push(`ORDER BY l.price ${dir}`);
                break;
            case ListingSort.num:
                sql.push(`ORDER BY l.oheight ${dir}, l.oidx ${dir}`);
            default:
                sql.push(`ORDER BY l.spend_height ${dir} NULLS LAST, l.spend_idx ${dir}`);
        }

        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)
        
        // console.log(sql.join(' '), params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }
}