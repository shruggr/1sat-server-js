import { Address } from '@ts-bitcoin/core';
import { BadRequest, NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { pool, redis } from "../db";
import { Outpoint } from '../models/outpoint';
import { BSV20Txo } from '../models/bsv20Txo';
import { Token } from '../models/token';
import { SortDirection } from '../models/sort-direction';
import { Bsv20Status } from '../models/txo';
import { BalanceUpdate } from '../models/balanceUpdate';

const includeThreshold = 10000000
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

        const { rows } = await pool.query(`SELECT b.*, b.fund_total>=${includeThreshold} as included
            FROM bsv20  b
            WHERE b.status = 1 and b.tick != ''
            ${included ? `AND b.fund_total>=${includeThreshold}` : ''}
            ORDER BY b.${sort} ${dir}, b.idx ${dir}, b.vout ${dir}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        return rows.map(Token.fromRow)
    }

    @Get("v2")
    public async getAllBsv20V2Stats(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() sort: 'fund_total' | 'fund_used' | 'fund_balance' = 'fund_total',
        @Query() dir: 'asc' | 'desc' = 'desc',
        @Query() included = true,
    ): Promise<Token[]> {
        const { rows } = await pool.query(`SELECT b.*, b.fund_total>=${includeThreshold} as included
            FROM bsv20_v2 b
            ${included ? `WHERE fund_total>=${includeThreshold}` : ''}
            ORDER BY ${sort} ${dir}, b.idx ${dir}, b.vout ${dir}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        // ORDER BY b.${sort} ${dir}, b.idx ${dir}
        return rows.map(Token.fromRow)
    }

    @Get("outpoint/{outpoint}")
    public async getBsv20Outpoint(
        @Path() outpoint: string,
    ): Promise<BSV20Txo> {
        const op = Outpoint.fromString(outpoint)
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE txid=$1 AND vout=$2`
        const params = [op.txid, op.vout]

        // console.log(sql, params)
        const { rows: [row] } = await pool.query(sql, params);
        if (!row) {
            throw new NotFound();
        }
        return BSV20Txo.fromRow(row);
    }

    @Get("spends/{txid}")
    public async getBsv20Spends(
        @Path() txid: string,
    ): Promise<BSV20Txo[]> {
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE spend=$1`
        const params = [Buffer.from(txid, 'hex')]

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map(row => BSV20Txo.fromRow(row));
    }

    @Get("{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
    ): Promise<TokenBalanceResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const hashBuf = Address.fromString(address).hashBuf

        const sql = `SELECT txid, vout, op, tick, id, listing, status, amt
            FROM bsv20_txos
            WHERE pkhash=$1 AND spend='\\x' AND status IN (0, 1)`
        const { rows } = await pool.query(sql, [hashBuf]);
        // console.log(sql, hashBuf.toString('hex'))

        const results: { [ticker: string]: TokenBalance } = {};
        let ids = new Set<string>()
        let ticks = new Set<string>()
        for (let row of rows) {
            let key = row.tick;

            let tokenId = ''
            if (row.id?.length) {
                tokenId = Outpoint.fromBuffer(row.id).toString()
                key = tokenId
                ids.add(tokenId)
            }
            else if (row.tick) ticks.add(row.tick);

            let tokenBal = results[key]
            if (!tokenBal) {
                tokenBal = new TokenBalance(row.tick, tokenId)
                results[key] = tokenBal
            }

            const amt = BigInt(row.amt)
            if (row.status == 1) {
                tokenBal.all.confirmed += amt
                if (row.listing) {
                    tokenBal.listed.confirmed += amt
                }
            } else {
                tokenBal.all.pending += amt
                if (row.listing) {
                    tokenBal.listed.pending += amt
                }
            }
        }

        const symbols = new Map<string, { sym: string, dec?: number, icon?: string }>();
        await Promise.all([
            (async () => {
                if (ticks.size) {
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
                if (ids.size) {
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

            if (r.id) {
                o.id = r.id;
                o.sym = symbols.get(r.id)?.sym;
                o.dec = symbols.get(r.id)?.dec;
                o.icon = symbols.get(r.id)?.icon
            } else if (r.tick) {
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
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing = false
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND tick=$2
                ${listing ? 'AND listing=true' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/tick/{tick}/history")
    public async getBsv20UtxoHistoryByTick(
        @Path() address: string,
        @Path() tick: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing = false
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend != '\\x' AND 
                status=1 AND tick=$2
                ${listing ? 'AND listing=true' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/id/{id}")
    public async getBsv20UtxosById(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing = false
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND id=$2
                ${listing ? 'AND listing=true' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/id/{id}/history")
    public async getBsv20UtxoHistoryById(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing = false
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend != '\\x' AND 
                status=1 AND id=$2
                ${listing ? 'AND listing=true' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/unspent")
    public async getBsv20UtxosByAddress(
        @Path() address: string,
        @Query() status?: Bsv20Status,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $${params.push(add.hashBuf)} AND spend = '\\x'
                ${status !== undefined ? `AND status=$${params.push(status)}` : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("tick/{tick}")
    public async getBsv20TickStats(
        @Path() tick: string,
    ): Promise<Token> {
        if (tick.length > 4 || tick.includes("'") || tick.includes('"')) {
            throw new BadRequest();
        }
        tick = tick.toUpperCase();

        const { rows: [row] } = await pool.query(`
            SELECT *
            FROM bsv20
            WHERE status IN (0,1) AND tick=$1`,
            [tick],
        );
        if (!row) {
            throw new NotFound();
        }

        const token = Token.fromRow(row);

        let accounts = await redis.get(`accts:${tick}`)
        if (!accounts) {
            const { rows: [row]} = await pool.query(`
                SELECT COUNT(DISTINCT pkhash) as count
                FROM bsv20_txos
                WHERE spend='\\x' AND tick=$1 AND status=1`,
                [tick],
            )
            accounts = row.count
            await redis.set(`accts:${tick}`, row.count , 'EX', 600)
        }
        token.accounts = parseInt(accounts || '0', 10)

        const fundsJson = await redis.hget("v1funds", tick)
        if(fundsJson) {
            const funds = JSON.parse(fundsJson) as BalanceUpdate
            token.included = funds.fundTotal >= includeThreshold
            token.pending = funds.pending
            token.fundTotal = funds.fundTotal
            token.fundUsed = funds.fundUsed
            token.fundBalance = funds.fundTotal - funds.fundUsed
            token.pendingOps = funds.pendingOps
        }

        return token;
    }

    @Get("tick/{tick}/holders")
    public async getBsv20TickHolders(
        @Path() tick: string,
        @Query() limit = 10,
    ): Promise<{ address: string, amt: string }[]> {
        if (tick.length > 4 || tick.includes("'") || tick.includes('"')) {
            throw new BadRequest();
        }
        tick = tick.toUpperCase();
        const cacheKey = `tick:${tick}:holders`

        // this.setHeader('Cache-Control', 'max-age=3600')
        const status = await redis.get(cacheKey);
        if (status) {
            return JSON.parse(status).slice(0, limit);
        }

        const { rows } = await pool.query(`
            SELECT pkhash, SUM(amt) as amt
            FROM bsv20_txos
            WHERE tick=$1 AND status=1 AND spend='\\x' and pkhash != '\\x'
            GROUP BY pkhash
            ORDER BY amt DESC`,
            [tick],
        );
        const tokens = rows.map(r => ({
            address: Address.fromPubKeyHashBuf(r.pkhash).toString(),
            amt: r.amt,
        }))
        await redis.set(cacheKey, JSON.stringify(tokens), 'EX', 60);
        return tokens.slice(0, limit);
    }

    @Get("id/{id}")
    public async getBsv20V2Stats(
        @Path() id: string,
    ): Promise<Token> {
        const tokenId = Outpoint.fromString(id).toBuffer();
        const { rows: [row] } = await pool.query(`
            SELECT *, fund_total>=${includeThreshold} as included
            FROM bsv20_v2
            WHERE id=$1`,
            [tokenId],
        );
        if (!row) {
            throw new NotFound();
        }
        const token = Token.fromRow(row);


        let accounts = await redis.get(`accts:${id}`)
        if (!accounts) {
            const { rows: [row]} = await pool.query(`
                SELECT COUNT(DISTINCT pkhash) as count
                FROM bsv20_txos
                WHERE spend='\\x' AND id=$1 AND status=1`,
                [tokenId],
            )
            if (row) {
                accounts = row.count.toString() 
                await redis.set(`accts:${id}`, accounts || '0', 'EX', 60)
            }
        }
        token.accounts = parseInt(accounts || '0', 10)

        const fundsJson = await redis.hget("v2funds", id)
        if(fundsJson) {
            const funds = JSON.parse(fundsJson) as BalanceUpdate
            token.included = funds.fundTotal >= includeThreshold
            token.fundTotal = funds.fundTotal
            token.fundUsed = funds.fundUsed
            token.fundBalance = funds.fundTotal - funds.fundUsed
            token.pendingOps = funds.pendingOps
        }
        return token;
    }

    @Get("id/{id}/holders")
    public async getBsv20V2Holders(
        @Path() id: string,
        @Query() limit = 10,
    ): Promise<{ address: string, amt: string }[]> {
        const cacheKey = `id:${id}:holders`
        this.setHeader('Cache-Control', 'max-age=300')
        const status = await redis.get(cacheKey);
        if (status) {
            return JSON.parse(status).slice(0, limit);
        }

        const { rows } = await pool.query(`
            SELECT pkhash, SUM(amt) as amt
            FROM bsv20_txos
            WHERE id=$1 AND status=1 AND spend='\\x'
            GROUP BY pkhash
            ORDER BY amt DESC
            LIMIT 10`,
            [Outpoint.fromString(id).toBuffer()],
        );
        const tokens = rows.map(r => ({
            address: Address.fromPubKeyHashBuf(r.pkhash).toString(),
            amt: r.amt,
        }))
        await redis.set(cacheKey, JSON.stringify(tokens), 'EX', 60);
        return tokens.slice(0, limit);
    }

    @Get("market")
    public async getBsv20Market(
        @Query() sort: 'price' | 'price_per_token' | 'height' = 'height',
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type: 'v1' | 'v2' | 'all' = 'all',
        @Query() id?: string,
        @Query() tick?: string,
    ): Promise<BSV20Txo[]> {
        let params: any[] = [];
        let where = `t.spend='\\x' AND t.listing=true AND t.status=1 `
        if (id) {
            where += `AND t.id = $${params.push(Outpoint.fromString(id).toBuffer())} `
        }
        if (tick) {
            where += `AND t.tick = $${params.push(tick.toUpperCase())} `
        }

        // const fields string[] = ['t.*']
        // switch(type) {
        //     case 'all':
        //         fields.push('b2.sym', 'b2.icon', 'b2.dec as b2dec', 'b1.dec b1dec')
        //         break;
        //     case 'v1':
        //         break;
        //     case 'v2':
        //         break;
        // }
        // if(type ==)
        if (type == 'v1') {
            where += `AND t.tick != '' `
        } else if (type == 'v2') {
            where += `AND t.id != '\\x' `
        }

        let sql = `SELECT t.*, b2.sym, b2.icon, b2.dec as b2dec, b1.dec b1dec
            FROM bsv20_txos t
            LEFT JOIN bsv20 b1 ON b1.tick=t.tick AND b1.status=1 AND b1.tick!=''
            LEFT JOIN bsv20_v2 b2 ON b2.id=t.id
            WHERE ${where}
            ORDER BY ${sort} ${dir} 
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params);
        const { rows } = await pool.query(sql, params)
        return rows.map(BSV20Txo.fromRow)
    }

    @Get("market/sales")
    public async getBsv20Sales(
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() type: 'v1' | 'v2' | 'all' = 'all',
        @Query() id?: string,
        @Query() tick?: string,
        @Query() pending = false,
    ): Promise<BSV20Txo[]> {
        let params: any[] = [];
        let where = 't.sale=true '
        if (pending) {
            where += 'AND t.status IN (0,1) '
        } else {
            where += 'AND t.status = 1 '
        }

        if (type == 'v1') {
            where += "AND t.tick != '' "
        } else if (type == 'v2') {
            where += "AND t.id != '\\x' "
        }
        if (id) {
            where += `AND t.id = $${params.push(Outpoint.fromString(id).toBuffer())} `
        }
        if (tick) {
            where += `AND t.tick = $${params.push(tick.toUpperCase())} `
        }

        let sql = `SELECT t.*, b2.sym, b2.icon, b2.dec as b2dec, b1.dec b1dec
            FROM bsv20_txos t
            LEFT JOIN bsv20 b1 ON b1.tick=t.tick AND b1.status=1 AND b1.tick!=''
            LEFT JOIN bsv20_v2 b2 ON b2.id=t.id
            WHERE ${where}
            ORDER BY t.spend_height ${dir}, t.spend_idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params);
        const { rows } = await pool.query(sql, params)
        return rows.map(BSV20Txo.fromRow)
    }
}

class TokenBalance {
    constructor(public tick?: string, public id?: string) { }
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