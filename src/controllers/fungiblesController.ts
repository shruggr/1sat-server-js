import { Address } from '@ts-bitcoin/core';
import { BadRequest } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { pool } from "../db";
import { Bsv20Status, Txo } from '../models/txo';

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
    available: number,
    pctMinted: number,
    accounts: number,
    pending: number,
}

@Route("api/bsv20")
export class FungiblesController extends Controller {
    @Get("{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
    ): Promise<TokenBalance[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const hashBuf = Address.fromString(address).hashBuf
        const sql = `SELECT 
                COALESCE(data->'bsv20'->>'tick', data->'bsv20'->>'id') as tick,
                CASE WHEN data->>'list' IS NOT NULL THEN true ELSE false END as listing,
                data->'bsv20'->>'status' as status,
                SUM(COALESCE(data->'bsv20'->>'amt', '0')::NUMERIC) as amt
            FROM txos
            WHERE pkhash=$1 AND spend='\\x' AND 
                (data->'bsv20'->>'status' = '0' OR data->'bsv20'->>'status' = '1') AND
                data->'bsv20'->>'op' != 'deploy'
            GROUP BY tick, listing, status`
        console.log(sql, hashBuf.toString('hex'))
        const { rows } = await pool.query(sql, [hashBuf]);

        // console.log("BALANCE ROWS:", rows)
        const results: {[ticker: string]:TokenBalance} = {};
        for (let row of rows) {
            let tick = results[row.tick]
            if(!tick) {
                tick = new TokenBalance(row.tick)
                results[row.tick] = tick
            }

            const amt = parseInt(row.amt, 10)
            if(row.status == '1') {
                tick.all.confirmed += amt
                if(row.listing) {
                    tick.listed.confirmed += amt
                }
            } else { 
                tick.all.pending += amt
                if(row.listing) {
                    tick.listed.pending += amt
                }
            }
        }
        return Object.values(results)
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
        const params: any[] = [add.hashBuf, id];
        let sql = `SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
                t.data->'bsv20'->>'status' = '1' AND
                t.data->'bsv20'->>'id' = $2 AND
                t.data->'bsv20'->>'amt' IS NOT NULL`
        
        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("tick/{tick}")
    public async getBsv20TickStats(
        @Path() tick: string
    ): Promise<Token> {
        if(tick.length > 4 || tick.includes("'") || tick.includes('"')) {
            throw new BadRequest();
        }
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
        return {...token, 
            txid: token.txid.toString('hex'),
            idx: parseInt(token.idx, 10)
        } as Token;
    }
}


class TokenBalance {
    constructor(public tick = '') {}
    all = new BalanceItem()
    listed = new BalanceItem()
}

class BalanceItem {
    confirmed = 0
    pending = 0
}