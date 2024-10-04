import { Address } from '@ts-bitcoin/core';
import { BadRequest, NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { cache, pool, redis } from "../db";
import { Outpoint } from '../models/outpoint';
import { BSV20Txo } from '../models/bsv20Txo';
import { Token } from '../models/token';
import { SortDirection } from '../models/sort-direction';
import { Bsv20Status } from '../models/txo';
import { BalanceUpdate } from '../models/balanceUpdate';

export type TokenStatus = {
    id?: string,
    tick?: string,
    status: Bsv20Status,
    height: number,
}

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
        @Query() sort: 'fund_total' | 'fund_used' | 'fund_balance' | 'height' = 'fund_total',
        @Query() dir: 'asc' | 'desc' = 'desc',
        @Query() included = true,
    ): Promise<Token[]> {
        const { rows } = await pool.query(`SELECT b.*, b.fund_total>=${includeThreshold} as included, t.data
            FROM bsv20_v2 b
            JOIN txos t ON t.outpoint = b.id
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
        const sql = `SELECT t.*, v1.dec as b1dec, v2.sym, v2.icon, v2.dec as b2dec
            FROM bsv20_txos t
            LEFT JOIN bsv20 v1 ON v1.tick=t.tick and v1.status=1
            LEFT JOIN bsv20_v2 v2 ON v2.id=t.id
            WHERE t.txid=$1 AND t.vout=$2`
        const params = [op.txid, op.vout]

        // console.log(sql, params)
        let { rows: [row] } = await pool.query(sql, params);
        if (!row) {
            throw new NotFound();
        }
        return BSV20Txo.fromRow(row);
    }

    @Get("txid/{txid}")
    public async getBsv20ByTxid(
        @Path() txid: string,
    ): Promise<BSV20Txo[]> {
        const sql = `SELECT t.*, v1.dec as b1dec, v2.sym, v2.icon, v2.dec as b2dec
            FROM bsv20_txos t
            LEFT JOIN bsv20 v1 ON v1.tick=t.tick and v1.status=1
            LEFT JOIN bsv20_v2 v2 ON v2.id=t.id
            WHERE t.txid=$1`
        const params = [Buffer.from(txid, 'hex')]

        // console.log(sql, params)
        let { rows } = await pool.query(sql, params);
        return rows.map(row => BSV20Txo.fromRow(row));
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
        return this.calcBalance([address])
    }

    @Get("balance")
    public async getBalanceByAddresses(
        @Query() addresses: string[],
    ): Promise<TokenBalanceResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return this.calcBalance(addresses)
    }

    public async calcBalance(addresses: string[]) {
        const hashBufs = addresses.map(a => Address.fromString(a).hashBuf)
        const sql = `SELECT txid, vout, op, tick, id, listing, status, amt
            FROM bsv20_txos
            WHERE pkhash=ANY($1) AND spend='\\x' AND status IN (0, 1) AND op != 'burn'`
        const { rows } = await pool.query(sql, [hashBufs]);

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
        @Query() listing?: boolean
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        if (listing !== undefined) {
            params.push(listing)
        }
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND tick=$2 AND op != 'burn'
                ${listing !== undefined ? 'AND listing=$3' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/tick/{tick}/status")
    public async getBsv20Status(
        @Path() address: string,
        @Path() tick: string,
        @Query() since = 0,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
    ): Promise<TokenStatus[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick, since];
        let sql = `SELECT txid, vout, height, status
            FROM bsv20_txos
            WHERE pkhash=$1 AND status!=0 AND tick=$2 AND height >= $3
            ORDER BY status, height, idx
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows;
    }

    @Get("{address}/tick/{tick}/history")
    public async getBsv20UtxoHistoryByTick(
        @Path() address: string,
        @Path() tick: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing?: boolean,
        @Query() sale?: boolean,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];

        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend != '\\x' AND 
                status=1 AND tick=$2
                ${listing !== undefined ? `AND listing=$${params.push(listing)}` : ''}
                ${sale !== undefined ? `AND sale=$${params.push(sale)}` : ''}
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
        @Query() listing?: boolean,
        @Query() includePending = false
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        if (listing !== undefined) {
            params.push(listing)
        }

        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                id=$2 AND op != 'burn'
                ${includePending ? 'AND status IN (0, 1) ' : 'AND status=1 '}
                ${listing !== undefined ? 'AND listing=$3' : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/id/{id}/status")
    public async getBsv21Status(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() since = 0,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer(), since];
        let sql = `SELECT txid, vout, height, status
            FROM bsv20_txos
            WHERE pkhash=$1 AND status!=0 AND id=$2 AND height>=$3 
            ORDER BY status, height, idx
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`


        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows;
    }

    @Get("{address}/id/{id}/deps")
    public async getBsv20UtxosByIdWithDeps(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
    ): Promise<{ [txid: string]: string[] }> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT DISTINCT encode(spend, 'hex') as txid, encode(txid, 'hex') || '_' || vout as dep
            FROM bsv20_txos d
            WHERE spend IN (
                SELECT txid
                FROM bsv20_txos
                WHERE status=1 AND spend = '\\x' AND pkhash = $1 AND id=$2
                ORDER BY height, idx
                LIMIT $${params.push(limit)}
                OFFSET $${params.push(offset)}
            )`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        const results = rows.reduce((acc: { [txid: string]: string[] }, row: any) => {
            if (!acc[row.txid]) acc[row.txid] = []
            acc[row.txid].push(row.dep)
            return acc
        }, {})
        return results;
    }

    @Get("{address}/id/{id}/history")
    public async getBsv20UtxoHistoryById(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() listing?: boolean,
        @Query() sale?: boolean,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];

        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend != '\\x' AND 
                status=1 AND id=$2
                ${listing !== undefined ? `AND listing=$${params.push(listing)}` : ''}
                ${sale !== undefined ? `AND sale=$${params.push(sale)}` : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/locks")
    public async getBsv20Locks(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf];
        let sql = `SELECT b.*, t.data->>'lock' as lock
            FROM txos t
            JOIN bsv20_txos b ON b.txid=t.txid AND b.vout=t.vout
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
            t.data ? 'lock' AND b.status=1 AND b.op != 'burn'
            ORDER BY t.height ${dir}, t.idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map(BSV20Txo.fromRow);
    }

    @Get("id/{id}/locked")
    public async getBsv20LocksById(
        @Path() id: string,
    ): Promise<number> {
        const cacheId = `locked:${id}`
        let cached = await cache.get(cacheId)
        if (cached) {
            return parseInt(cached, 10)
        }
        const params: any[] = [Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT sum(b.amt) as locked_amt
            FROM txos t
            JOIN bsv20_txos b ON b.txid=t.txid AND b.vout=t.vout
            WHERE t.spend = '\\x' AND 
                t.data ? 'lock' AND b.status=1 AND b.id=$1`

        // console.log(sql, params)
        const { rows: [stats] } = await pool.query(sql, params);
        await cache.set(cacheId, stats.locked_amt, 'EX', 600)
        return stats.locked_amt
    }

    @Get("id/{id}/burned")
    public async getBsv20BurnsById(
        @Path() id: string,
    ): Promise<number> {
        const cacheId = `burned:${id}`
        let cached = await cache.get(cacheId)
        if (cached) {
            return parseInt(cached, 10)
        }
        const params: any[] = [Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT COALESCE(sum(amt), 0) as burned_amt
            FROM bsv20_txos
            WHERE status=1 AND op='burn' AND id=$1`

        // console.log(sql, params)
        const { rows: [stats] } = await pool.query(sql, params);
        await cache.set(cacheId, stats.burned_amt, 'EX', 600)
        return stats.burned_amt
    }


    @Get("{address}/id/{id}/locks")
    public async getAddressBsv20LocksById(
        @Path() address: string,
        @Path() id: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT b.*, t.data->>'lock' as lock
            FROM txos t
            JOIN bsv20_txos b ON b.txid=t.txid AND b.vout=t.vout
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
                t.data ? 'lock' AND b.status=1 AND b.id=$2
            ORDER BY t.height ${dir}, t.idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map(BSV20Txo.fromRow);
    }

    @Get("{address}/tick/{tick}/locks")
    public async getAddressBsv20LocksByTick(
        @Path() address: string,
        @Path() tick: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, tick];
        let sql = `SELECT b.*, t.data->>'lock' as lock
            FROM txos t
            JOIN bsv20_txos b ON b.txid=t.txid AND b.vout=t.vout
            WHERE t.pkhash = $1 AND t.spend = '\\x' AND 
                t.data ? 'lock' AND b.status=1 AND b.tick=$2
            ORDER BY t.height ${dir}, t.idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map(BSV20Txo.fromRow);
    }

    @Get("{address}/unspent")
    public async getBsv20UtxosByAddress(
        @Path() address: string,
        @Query() status?: Bsv20Status,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() type: 'v1' | 'v2' | 'all' = 'all',
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $${params.push(add.hashBuf)} AND spend = '\\x' AND op != 'burn'
                ${status !== undefined ? `AND status=$${params.push(status)}` : ''}
                ${type == 'v1' ? "AND tick != ''" : type == 'v2' ? "AND id != '\\x'" : ''}
            ORDER BY height ${dir}, idx ${dir}
            LIMIT $${params.push(limit)}
            OFFSET $${params.push(offset)}`

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => BSV20Txo.fromRow(row));
    }

    @Get("{address}/history")
    public async getBsv20HistoryByAddress(
        @Path() address: string,
        @Query() status?: Bsv20Status,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.DESC,
        @Query() type: 'v1' | 'v2' | 'all' = 'all',
    ): Promise<BSV20Txo[]> {
        const add = Address.fromString(address);
        const params: any[] = [];
        let sql = `SELECT *
            FROM bsv20_txos
            WHERE pkhash = $${params.push(add.hashBuf)} AND spend != '\\x'
                ${status !== undefined ? `AND status=$${params.push(status)}` : ''}
                ${type == 'v1' ? "AND tick != ''" : type == 'v2' ? "AND id != '\\x'" : ''}
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

        let accounts = await cache.get(`accts:${tick}`)
        if (!accounts) {
            const { rows: [row] } = await pool.query(`
                SELECT COUNT(DISTINCT pkhash) as count
                FROM bsv20_txos
                WHERE spend='\\x' AND tick=$1 AND status=1`,
                [tick],
            )
            accounts = row.count
            await cache.set(`accts:${tick}`, row.count, 'EX', 600)
        }
        token.accounts = parseInt(accounts || '0', 10)

        const fundsJson = await redis.hget("v1funds", tick)
        if (fundsJson) {
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
        @Query() offset = 0,
    ): Promise<{ address: string, amt: string }[]> {
        if (tick.length > 4 || tick.includes("'") || tick.includes('"')) {
            throw new BadRequest();
        }
        tick = tick.toUpperCase();
        const cacheKey = `tick:${tick}:holders`

        // this.setHeader('Cache-Control', 'max-age=3600')
        const status = await cache.get(cacheKey);
        if (status) {
            return JSON.parse(status).slice(offset, offset + limit);
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
        await cache.set(cacheKey, JSON.stringify(tokens), 'EX', 300);
        return tokens.slice(offset, offset + limit);
    }

    @Get("id/{id}")
    public async getBsv20V2Stats(
        @Path() id: string,
    ): Promise<Token> {
        const tokenId = Outpoint.fromString(id).toBuffer();
        const { rows: [row] } = await pool.query(`
            SELECT b.*, fund_total>=${includeThreshold} as included, t.data
            FROM bsv20_v2 b
            JOIN txos t ON t.txid=b.txid AND t.vout=b.vout
            WHERE id=$1`,
            [tokenId],
        );
        if (!row) {
            throw new NotFound();
        }
        const token = Token.fromRow(row);


        let accounts = await cache.get(`accts:${id}`)
        if (!accounts) {
            const { rows: [row] } = await pool.query(`
                SELECT COUNT(DISTINCT pkhash) as count
                FROM bsv20_txos
                WHERE spend='\\x' AND id=$1 AND status=1`,
                [tokenId],
            )
            if (row) {
                accounts = row.count.toString()
                await cache.set(`accts:${id}`, accounts || '0', 'EX', 60)
            }
        }
        token.accounts = parseInt(accounts || '0', 10)

        const fundsJson = await redis.hget("v2funds", id)
        if (fundsJson) {
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
        @Query() offset = 0,
    ): Promise<{ address: string, amt: string }[]> {
        const cacheKey = `id:${id}:holders`
        this.setHeader('Cache-Control', 'max-age=300')

        const status = await cache.get(cacheKey);
        if (status) {
            return JSON.parse(status).slice(offset, offset + limit);
        }

        const { rows } = await pool.query(`
            SELECT pkhash, SUM(amt) as amt
            FROM bsv20_txos
            WHERE id=$1 AND status=1 AND spend='\\x'
            GROUP BY pkhash
            ORDER BY amt DESC`,
            [Outpoint.fromString(id).toBuffer()],
        );
        const tokens = rows.filter(r => r.pkhash?.length).map(r => ({
            address: Address.fromPubKeyHashBuf(r.pkhash).toString(),
            amt: r.amt,
        }))
        await cache.set(cacheKey, JSON.stringify(tokens), 'EX', 300);
        return tokens.slice(offset, offset + limit);
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
        @Query() address?: string,
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
        if (address) {
            const add = Address.fromString(address);
            where += `AND t.pkhash = $${params.push(add.hashBuf)} `
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

    @Get("{address}/id/{id}/ancestors")
    public async getBsv21Ancestors(
        @Path() address: string,
        @Path() id: string,
    ): Promise<{ [score: string]: string }> {
        const add = Address.fromString(address);
        const params: any[] = [add.hashBuf, Outpoint.fromString(id).toBuffer()];
        let sql = `SELECT DISTINCT txid, height, idx
            FROM bsv20_txos
            WHERE pkhash = $1 AND spend = '\\x' AND 
                status=1 AND id=$2`

        const { rows } = await pool.query(sql, params);
        const processed = new Map<number, string>()
        console.log("GET ANCESTORS", address, id, rows.length)
        for (let row of rows) {
            const txid = row.txid.toString('hex')
            // if (processed.has(txid)) continue
            // processed.set(row.height + (parseInt(row.idx) * Math.pow(2, -31)), txid)
            await this.getAncestors(txid, processed)
        }
        const response: { [score: string]: string } = {}
        for (let [score, txid] of processed.entries()) {
            response[score.toString()] = txid
        }
        return response
    }

    @Get("{outpoint}/ancestors")
    public async getBsv20Ancestors(
        @Path() outpoint: string,
    ): Promise<string[]> {
        const op = Outpoint.fromString(outpoint)

        const ancestors = await this.getAncestors(op.txid.toString('hex'))
        const keys = Array.from(ancestors.keys())
        keys.sort((a, b) => a - b)
        return keys.map(k => ancestors.get(k)!)
    }

    async getAncestors(txid: string, processed = new Map<number, string>()): Promise<Map<number, string>> {
        const parents = await redis.zrange(`dep:${txid}`, 0, -1, 'WITHSCORES')
        if (!parents.length) {
            return processed
        }
        for (let i = 0; i < parents.length; i += 2) {
            const parent = parents[i]
            const score = parseFloat(parents[i + 1])
            if (processed.has(score)) continue
            processed.set(score, parent)
            await this.getAncestors(parent, processed)
        }
        return processed
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