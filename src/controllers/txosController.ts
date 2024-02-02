import { Address } from '@ts-bitcoin/core';
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { Txo } from "../models/txo";
import { loadTx, pool, redis } from "../db";
import { TxoData } from "../models/txo";
import { Outpoint } from '../models/outpoint';
import { SortDirection } from '../models/sort-direction';

@Route("api/txos")
export class TxosController extends Controller {
    @Get("address/{address}/unspent")
    public async getUnspentByAddress(
        @Path() address: string,
        @Query() q?: string,
        @Query() type?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20 = false,
        @Query() origins = false,
        @Query() refresh = false
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        await TxosController.refreshAddress(address, refresh);
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchByAddress(address, true, query, type, bsv20, origins, limit, offset);
    }

    @Post("address/{address}/unspent")
    public async postUnspentByAddress(
        @Path() address: string,
        @Body() query?: TxoData,
        @Query() type?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20 = false,
        @Query() origins = false,
        @Query() refresh = false
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        await TxosController.refreshAddress(address, refresh);
        const txos = await this.searchByAddress(address, true, query, type, bsv20, origins, limit, offset);
        return txos
    }

    @Get("address/{address}/history")
    public async getHistoryByAddress(
        @Path() address: string,
        @Query() q?: string,
        @Query() type?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20 = false,
        @Query() origins = false
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.searchByAddress(address, false, query, type, bsv20, origins, limit, offset);
    }

    @Post("address/{address}/history")
    public async postHistoryByAddress(
        @Path() address: string,
        @Body() query?: TxoData,
        @Query() type?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20 = false,
        @Query() origins = false
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.searchByAddress(address, false, query, type, bsv20, origins, limit, offset);
    }

    static async refreshAddress(address: string, force = false) {
        const { INDEXER } = process.env;
        const  start = Date.now();
        const cacheKey = `ad:${address}`
        const updated = await redis.get(cacheKey)
        if(!force && updated) {
            // console.log("Updated", updated, ". Skipping", address);
            return
        }

        console.log("Updating", address);
        try {
            await redis.pipeline()
                .set(cacheKey, Date.now())
                .expire(cacheKey, 1800)
                .exec();
            const resp  = await fetch(`${INDEXER}/ord/${address}`)
            if(resp.ok) {
                console.log("Refreshed address:", address, `${Date.now() - start}ms`)
            } else {
                redis.del(cacheKey)
                console.log("Failed to refresh address:", address, resp.status, await resp.text())
            }
        } catch(e) {
            redis.del(cacheKey)
            console.log("Refresh failed:", address)
        }
    }

    @Get("address/{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
        @Query() refresh = false
    ): Promise<number> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        await TxosController.refreshAddress(address, refresh);
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        const {rows: [{balance}]} = await pool.query(`
            SELECT SUM(satoshis) as balance
            FROM txos
            WHERE pkhash=$1 AND spend='\\x'`,
            params,
        )
        return balance;
    }

    @Get("{outpoint}")
    public async getTxoByOutpoint(
        @Path() outpoint: string,
        @Query() script = false
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const txo = await Txo.getByOutpoint(Outpoint.fromString(outpoint));
        if (script) {
            const tx = await loadTx(txo.txid);
            txo.script = tx.txOuts[txo.vout].script.toBuffer().toString('base64');
        }
        return txo
    }

    @Post("outpoints")
    public async postOutpoints(
        @Body() outpoints: string[],
        @Query() script = false,
    ): Promise<Txo[]> {
        const op = outpoints.map((op) => Outpoint.fromString(op).toBuffer());
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            LEFT JOIN txos o ON o.outpoint = t.origin
            WHERE t.outpoint = ANY($1)`,
            [op]
        );
        return Promise.all(rows.map(async (row: any) => {
            const txo = Txo.fromRow(row)
            if (script) {
                const tx = await loadTx(txo.txid);
                txo.script = tx.txOuts[txo.vout].script.toBuffer().toString('base64');
            }
            return txo;
        }));
    }

    public async searchByAddress(address: string, unspent = true, query?: TxoData, type = '', bsv20 = false, origins = false, limit: number = 100, offset: number = 0): Promise<Txo[]> {
        // const start = Date.now();
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        let sql = [`SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            LEFT JOIN txos o ON o.outpoint = t.origin
            WHERE t.pkhash = $1`]
        if (unspent) {
            sql.push(`AND t.spend = '\\x'`)
        } else {
            sql.push(`AND t.spend != '\\x'`)
        }
        if (bsv20) {
            sql.push(`AND t.data->'bsv20' IS NOT NULL`)
        } else {
            sql.push(`AND t.data->'bsv20' IS NULL`)
        }
        if (query) {
            params.push(query);
            sql.push(`AND (t.data @> $${params.length} OR o.data @> $${params.length})`)
        }

        if (type) {
            params.push(`${type}%`);
            sql.push(`AND t.data->'insc'->'file'->>'type' like $${params.length}`)
        }

        sql.push(`ORDER BY height DESC, idx DESC`)
        params.push(limit);
        sql.push(`LIMIT $${params.length}`)
        params.push(offset);
        sql.push(`OFFSET $${params.length}`)

        // console.log(sql.join(' '), params)
        const { rows } = await pool.query(sql.join(' '), params);
        // console.log("Returning:", rows.length, address, Date.now() - start)
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("search")
    public async getTxoSearchAll(
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        // console.log("Query:", query)
        return Txo.search(false, query, limit, offset, dir);
    }

    @Post("search")
    public async postTxoSearchAll(
        @Body() query?: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        console.log("POST search")
        return Txo.search(false, query, limit, offset, dir);
    }

    @Get("search/unspent")
    public async getTxoSearchUnspent(
        @Query() q?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return Txo.search(true, query, limit, offset, dir);
    }

    @Post("search/unspent")
    public async postTxoSearchUnspent(
        @Body() query?: TxoData,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.search(true, query, limit, offset, dir);
    }
}
