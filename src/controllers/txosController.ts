import { Address } from '@ts-bitcoin/core';
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { Txo } from "../models/txo";
import { pool } from "../db";
import { TxoData } from "../models/txo";

@Route("api/txos")
export class TxosController extends Controller {

    @Get("address/{address}/unspent")
    public async getUnspentByAddress(
        @Path() address: string,
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0

    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchByAddress(address, true, query, limit, offset);
    }

    @Post("address/{address}/unspent")
    public async postUnspentByAddress(
        @Path() address: string,
        @Body() query?: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchByAddress(address, true, query, limit, offset);
    }

    @Get("address/{address}/history")
    public async getHistoryByAddress(
        @Path() address: string,
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0

    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchByAddress(address, false, query, limit, offset);
    }

    @Post("address/{address}/history")
    public async postHistoryByAddress(
        @Path() address: string,
        @Body() query?: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchByAddress(address, false, query, limit, offset);
    }

    public async searchByAddress(address: string, unspent = true, query?: TxoData, limit: number = 100, offset: number = 0): Promise<Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        let sql = [`SELECT t.*, o.data as odata, o.num
            FROM txos t
            JOIN origins o ON o.origin = t.origin 
            WHERE pkhash = $1`]
        if(unspent) {
            sql.push(`AND spend = '\\x'`)
        }
        if(query) {
            params.push(query);
            sql.push(`AND data @> $${params.length}`)
        }
        sql.push(`ORDER BY height DESC, idx DESC`)
        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)
        
        console.log(sql, params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }
}
