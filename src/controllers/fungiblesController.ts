import { Address } from '@ts-bitcoin/core';
import { BadRequest, NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { pool } from "../db";
// import { Bsv20Status, Txo } from '../models/txo';
import { Outpoint } from '../models/outpoint';
import { BSV20Txo } from '../models/bsv20Txo';
import { Token } from '../models/token';



@Route("api/bsv20")
export class FungiblesController extends Controller {
    @Get("")
    public async getBsv20Stats(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() sort: 'pct_minted' | 'available' | 'tick' | 'max' | 'height' = 'height',
        @Query() dir: 'asc' | 'desc' = 'desc',
        @Query() included = true,
    ): Promise<Token[]> {

        const {rows} = await pool.query(`SELECT b.*, CASE WHEN s.tick != '' THEN true ELSE false END as included
            FROM bsv20  b
            ${included ? '' : 'LEFT'} JOIN bsv20_subs s ON s.tick = b.tick
            WHERE b.status = 1 and b.tick != ''
            ORDER BY b.${sort} ${dir}, b.idx ${dir}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        return rows.map(t => ({
            ...t,
            txid: t.txid.toString('hex'),
        }))
    }

    @Get("v2")
    public async getAllBsv20V2Stats(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        // @Query() sort: 'pct_minted' | 'available' | 'tick' | 'max' | 'height' = 'height',
        // @Query() dir: 'asc' | 'desc' = 'desc',
        @Query() included = true,
    ): Promise<Token[]> {

        const {rows} = await pool.query(`SELECT b.*, CASE WHEN s.id != '\\x' THEN true ELSE false END as included
            FROM bsv20_v2  b
            ${included ? '' : 'LEFT'} JOIN bsv20_subs s ON s.id = b.id
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
                    // ORDER BY b.${sort} ${dir}, b.idx ${dir}
        return rows.map(t => ({
            ...t,
            id: Outpoint.fromBuffer(t.id).toString(),
            icon: t.icon && Outpoint.fromBuffer(t.icon).toString(),
            txid: t.txid.toString('hex')
        }))
    }

    @Get("{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
    ): Promise<TokenBalanceResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const hashBuf = Address.fromString(address).hashBuf
    
        const sql = `SELECT txid, vout, op, tick, id, listing, status, amt
            FROM bsv20_txos
            WHERE pkhash=$1 AND spend='\\x' AND 
                status >= 0`
        const { rows } = await pool.query(sql, [hashBuf]);
        console.log(sql, hashBuf.toString('hex'))

        const results: {[ticker: string]:TokenBalance} = {};
        let ids = new Set<string>()
        let ticks = new Set<string>()
        for (let row of rows) {
            let key = row.tick;

            let tokenId = ''
            if(row.id.length) {
                tokenId = Outpoint.fromBuffer(row.id).toString()
                key = tokenId
                ids.add(tokenId)
            }
            else if(row.tick) ticks.add(row.tick);

            let tokenBal = results[key]
            if(!tokenBal) {
                tokenBal = new TokenBalance(row.tick, tokenId)
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

        const symbols = new Map<string, {sym: string, dec?: number, icon?: string}>();
        await Promise.all([
            (async () => {
                if(ticks.size) {
                    const { rows: tickRows } = await pool.query(`
                        SELECT tick, dec
                        FROM bsv20 
                        WHERE status=1 AND tick = ANY($1)`, 
                        [Array.from(ticks)]
                    )
                    tickRows.forEach(row => {
                        symbols.set(row.tick, row)
                        // console.log('TICK', row.tick, row.dec)
                    });
                }
            })(),
            (async () => {
                if(ids.size) {
                    const { rows: symRows } = await pool.query(`
                        SELECT id, sym, dec, icon
                        FROM bsv20_v2
                        WHERE id = ANY($1)`, 
                        [Array.from(ids).map(id => Outpoint.fromString(id).toBuffer())]
                    )
                    symRows.forEach(row => {
                        const outpoint = Outpoint.fromBuffer(row.id).toString()
                        symbols.set(outpoint, {
                            ...row,
                            icon: row.icon && Outpoint.fromBuffer(row.icon).toString()
                        })
                        // console.log('SYM', outpoint, row.sym, row.dec)
                    });
                }
            })()
        ])
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
                o.sym = symbols.get(r.id)?.sym;
                o.dec = symbols.get(r.id)?.dec;
                o.icon = symbols.get(r.id)?.icon
            } else if(r.tick) {
                o.tick = r.tick;
                o.dec = symbols.get(r.tick)?.dec;
            }

            return o;
        })

    }

    @Get("{address}/tick/{tick}")
    public async getBsv20UtxosByTick(
        @Path() address: string,
        @Path() tick: string,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        let sql = `SELECT *
            FROM bsb20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND tick=$2 AND amt IS NOT NULL`
        
        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/id/{id}")
    public async getBsv20UtxosById(
        @Path() address: string,
        @Path() id: string,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, id, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT *
            FROM bsb20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND tick=$2 AND amt IS NOT NULL`
        
        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
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
        const { rows: [token] } = await pool.query(`SELECT b.*,
            a.accounts, p.pending, 
            CASE WHEN s.included > 0 THEN true ELSE false END as included
            FROM bsv20 b, (
                SELECT COUNT(DISTINCT pkhash) as accounts 
                FROM bsv20_txos 
                WHERE spend = '\\x' AND tick=$1 AND status=1
            ) a, (
                SELECT COALESCE(SUM(amt), 0) as pending
                FROM bsv20_txos m
                WHERE op='mint' AND tick=$1 AND status=0
            ) p, (
                SELECT COUNT(1) as included FROM bsv20_subs WHERE tick=$1
            ) s
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

    @Get("id/{id}")
    public async getBsv20V2Stats(
        @Path() id: string
    ): Promise<Token> {
        this.setHeader('Cache-Control', 'max-age=3600')
        const { rows: [token] } = await pool.query(`SELECT b.*, a.accounts, p.pending,
            CASE WHEN s.included > 0 THEN true ELSE false END as included
            FROM bsv20_v2 b, (
                SELECT COUNT(DISTINCT pkhash) as accounts 
                FROM bsv20_txos 
                WHERE spend = '\\x' AND id=$1 AND status=1
            ) a, (
                SELECT COALESCE(SUM(amt), 0) as pending
                FROM bsv20_txos
                WHERE id=$1 AND status=0
            ) p, (
                SELECT COUNT(1) as included FROM bsv20_subs WHERE id=$1
            ) s
            WHERE id=$1`,
            [Outpoint.fromString(id).toBuffer()],
        );
        if(!token) {
            throw new NotFound();
        }
        return Token.fromRow(token)
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
    dec?: number;
    icon?: string;
    all: {
        confirmed: string;
        pending: string;
    };
    listed: {
        confirmed: string;
        pending: string;
    }
}