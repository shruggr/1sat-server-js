import { Address } from '@ts-bitcoin/core';
import { BadRequest } from 'http-errors';
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { Txo, TxoData } from "../models/txo";
import { pool } from "../db";

@Route("api/locks")
export class LocksController extends Controller {
    @Get("txid/{txid}")
    public async getLocksByTxid(
        @Path() txid: string,
    ): Promise<Txo[]> {
        const { rows } = await pool.query(`SELECT *
            FROM txos
            WHERE txid = $1`,
            [Buffer.from(txid, 'hex')]
        );
        if (rows.length) {
            this.setHeader('Cache-Control', 'public,max-age=86400')
        }
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("address/{address}/unspent")
    public async getUnspentLocks(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchByAddress(address, true, undefined, limit, offset);
    }

    @Get("address/{address}/history")
    public async getLocksHistory(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchByAddress(address, false, undefined, limit, offset);
    }

    public async searchByAddress(address: string, unspent = true, query?: TxoData, limit: number = 100, offset: number = 0): Promise<Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        let sql = [`SELECT t.*
            FROM txos t
            WHERE t.pkhash = $1 AND data ? 'lock'`]
        if (unspent) {
            sql.push(`AND t.spend = '\\x'`)
        }
        if (query) {
            params.push(JSON.stringify(query));
            sql.push(`AND t.data @> $${params.length}`)
        }
        sql.push(`ORDER BY height DESC, idx DESC`)
        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)

        // console.log(sql, params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    public async contentByAddress(address: string, unspent = true, limit: number = 100, offset: number = 0): Promise<Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        let sql = [`SELECT *
            FROM txos
            WHERE txid IN (
                SELECT txid FROM txos 
                WHERE t.pkhash = $1 AND data ? 'lock'`]
        if (unspent) {
            sql.push(`AND t.spend = '\\x'`)
        } else {
            sql.push(`AND t.spend != '\\x'`)
        }
        sql.push(') t')
        sql.push(`ORDER BY height DESC, idx DESC`)
        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)

        // console.log(sql.join(' '), params)
        const { rows } = await pool.query(sql.join(' '), params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("search")
    public async getLocksSearch(
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.search(query, limit, offset);
    }

    @Post("search")
    public async postLocksSearch(
        @Body() query: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.search(query, limit, offset);
    }

    public async search(query?: TxoData, limit = 100, offset = 0): Promise<Txo[]> {
        if ((query as any)?.txid !== undefined) throw BadRequest('This is not a valid query. Reach out on 1sat discord for assistance.')
        const params: any[] = [JSON.stringify(query)];
        let sql = `SELECT t.*, l.data->>'lock' as lock
            FROM txos t
            JOIN txos l ON l.txid = t.txid
            WHERE t.data @> $1  AND l.data ? 'lock'`;

        params.push(limit);
        sql += `LIMIT $${params.length} `
        params.push(offset);
        sql += `OFFSET $${params.length} `

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => {
            const txo = Txo.fromRow(row)
            if (txo.data) {
                txo.data.lock = row.lock && JSON.parse(row.lock);
            }
            return txo;
        });
    }

    @Post("address/{address}/search")
    public async postLocksSearchByAddress(
        @Path() address: string,
        @Body() query: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        return this.searchByAddress(address, true, query, limit, offset);
    }
}
