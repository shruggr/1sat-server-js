import { Address } from '@ts-bitcoin/core';
import { BadRequest, NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { pool } from "../db";
import { Bsv20Status, Txo } from '../models/txo';
import { Outpoint } from '../models/outpoint';

export interface Token {
    txid: string,
    vout: number,
    height: number,
    idx: number,
    tick: string,
    max: string,
    lim: string,
    dec: number,
    supply: string,
    status: Bsv20Status,
    available: string,
    pctMinted: number,
    accounts: number,
    pending: number,
}

@Route("api/bsv20")
export class FungiblesController extends Controller {
    @Get("")
    public async getBsv20Stats(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() sort: 'pct_minted' | 'available' | 'tick' | 'max' | 'height' = 'height',
        @Query() dir: 'asc' | 'desc' = 'desc',
    ): Promise<Token[]> {

        const {rows} = await pool.query(`SELECT * 
            FROM bsv20 
            WHERE status = 1
            ORDER BY ${sort} ${dir}, idx ${dir}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        return rows.map(t => ({
            ...t,
            txid: t.txid.toString('hex'),
        }))
    }

    @Get("{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
    ): Promise<TokenBalanceResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const hashBuf = Address.fromString(address).hashBuf
    
        const sql = `SELECT outpoint,
                data->'bsv20'->>'op' as op,
                data->'bsv20'->>'tick' as tick,
                data->'bsv20'->>'id' as id,
                CASE WHEN data->>'list' IS NOT NULL THEN true ELSE false END as listing,
                data->'bsv20'->>'status' as status,
                COALESCE(data->'bsv20'->>'amt', '0')::NUMERIC as amt
            FROM txos
            WHERE pkhash=$1 AND spend='\\x' AND 
                (data->'bsv20'->>'status' = '0' OR data->'bsv20'->>'status' = '1') AND
                data->'bsv20'->>'op' != 'deploy'`
        const { rows } = await pool.query(sql, [hashBuf]);

        const results: {[ticker: string]:TokenBalance} = {};
        let ids = new Set<string>()
        for (let row of rows) {
            if(row.op == 'deploy+mint') {
                row.id = Outpoint.fromBuffer(row.outpoint).toString()
            }
            let key = row.id || row.tick;
            if(row.id) ids.add(row.id)
            let tokenBal = results[key]
            if(!tokenBal) {
                tokenBal = new TokenBalance(row.tick, row.id)
                results[key] = tokenBal
            }

            const amt = BigInt(row.amt)
            if(row.status == '1') {
                tokenBal.all.confirmed += amt
                if(row.listing) {
                    tokenBal.listed.confirmed += amt
                }
            } else { 
                tokenBal.all.pending += amt
                if(row.listing) {
                    tokenBal.listed.pending += amt
                }
            }
        }

        const symbols = new Map<string, string>();
        if(ids.size) {
            const { rows: symRows } = await pool.query(`
                SELECT outpoint, data->'bsv20'->>'sym' as sym
                FROM txos 
                WHERE outpoint = ANY($1)`, 
                [Array.from(ids).map(id => Outpoint.fromString(id).toBuffer())]
            )
            symRows.forEach(row => {
                const outpoint = Outpoint.fromBuffer(row.outpoint).toString()
                symbols.set(outpoint, row.sym)
                console.log('SYM', outpoint, row.sym)
            });
        }
        return Object.values(results).map(r => {
            const o: TokenBalanceResponse = {
                all: {
                    confirmed: r.all.confirmed.toString(),
                    pending: r.all.pending.toString()
                },
                listed: {
                    confirmed: r.listed.confirmed.toString(),
                    pending: r.listed.pending.toString()
                }
            }
            
            if(r.id) {
                o.id = r.id;
                o.sym = symbols.get(r.id);
            } else if(r.tick) o.tick = r.tick;

            return o;
        })

    }

    @Get("{address}/tick/{tick}")
    public async getBsv20UtxosByTick(
        @Path() address: string,
        @Path() tick: string,
    ): Promise<Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        let sql = `SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
                t.data->'bsv20'->>'status' = '1' AND
                t.data->'bsv20'->>'tick' = $2 AND
                t.data->'bsv20'->>'amt' IS NOT NULL`
        
        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("{address}/id/{id}")
    public async getBsv20UtxosById(
        @Path() address: string,
        @Path() id: string,
    ): Promise<Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, id, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
                t.data->'bsv20'->>'status' = '1' AND
                (t.data->'bsv20'->>'id' = $2 OR t.outpoint=$3)AND
                t.data->'bsv20'->>'amt' IS NOT NULL`
        
        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("tick/{tick}")
    public async getBsv20TickStats(
        @Path() tick: string
    ): Promise<Token> {
        this.setHeader('Cache-Control', 'max-age=3600')
        if(tick.length > 4 || tick.includes("'") || tick.includes('"')) {
            throw new BadRequest();
        }
        tick = tick.toUpperCase();
        const { rows: [token] } = await pool.query(`SELECT b.*, a.accounts, p.pending
            FROM bsv20 b, (
                SELECT COUNT(DISTINCT pkhash) as accounts 
                FROM txos 
                WHERE spend = '\\x' AND data @> '{"bsv20": {"status": 1, "tick": "${tick}"}}'
            ) a, (
                SELECT COALESCE(SUM(amt), 0) as pending
                FROM bsv20_mints m
                WHERE tick=$1 AND status=0
            ) p
            WHERE b.status = 1 AND tick=$1`,
            [tick],
        );
        if(!token) {
            throw new NotFound();
        }
        return {...token, 
            txid: token.txid.toString('hex'),
            idx: parseInt(token.idx, 10)
        } as Token;
    }

}


class TokenBalance {
    constructor(public tick?:string, public id?: string) {}
    all = new BalanceItem()
    listed = new BalanceItem()
}

class BalanceItem {
    confirmed = 0n
    pending = 0n
}

type TokenBalanceResponse = {
    tick?: string;
    id?: string;
    sym?: string;
    all: {
        confirmed: string;
        pending: string;
    };
    listed: {
        confirmed: string;
        pending: string;
    }
}