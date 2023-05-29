import { Address, Hash } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { pool } from "../db";
import { Bsv20 } from "../models/bsv20";
import { SortDirection } from '../models/listing';

enum Status {
    Invalid = "invalid",
    Valid = "valid",
    Pending = "pending",
    ValidAndPending = "valid_pending",
    All = "all",
}

enum Bsv20Sort {
    PctMinted = 'pct_minted',
    Available = 'available',
    Ticker = 'tick',
    Max = 'max',
    Height = 'height'
}

@Route("api/bsv20")
export class FungiblesController extends Controller {
    @Get("")
    public async getRecent(
        @Query() status = Status.ValidAndPending,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() sort: Bsv20Sort = Bsv20Sort.Height,
        @Query() dir: SortDirection = SortDirection.desc,
    ): Promise<Bsv20[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let where = '';
        switch(status) {
            case Status.Invalid:
                where = 'WHERE valid = FALSE'
                break
            case Status.Pending:
                where = 'WHERE valid IS NULL'
                break
            case Status.Valid:
                where = 'WHERE valid = TRUE'
                break
            case Status.ValidAndPending:
                where = 'WHERE valid = TRUE OR valid IS NULL'
        }
        const { rows } = await pool.query(`SELECT * 
            FROM bsv20 
            ${where}
            ORDER BY ${sort} ${dir}, idx ${dir}
            LIMIT $1 OFFSET $2`,
            [
                limit,
                offset
            ]
        )
        return rows.map(row => Bsv20.fromRow(row));
    }

    @Get("outpoint/{txid}/{vout}")
    public async getByOutpoint(
        @Path() txid: string,
        @Path() vout: number
    ): Promise<Bsv20> {
        this.setHeader('Cache-Control', 'public,immutable,max-age=31536000')
        const { rows } = await pool.query(`SELECT * FROM bsv20_txos 
                WHERE txid=$1 AND vout=$2`,
            [
                Buffer.from(txid, 'hex'), 
                vout,
            ]
        )

        if (rows.length === 0) {
            throw new NotFound()
        }
        return Bsv20.fromRow(rows[0]);
    }

    @Get("id/{id}")
    public async getById(
        @Path() id: string,
    ): Promise<Bsv20> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`SELECT * FROM bsv20 
                WHERE id=$1`,
            [id]
        )

        if (rows.length === 0) {
            throw new NotFound()
        }
        return Bsv20.fromRow(rows[0]);
    }
    
    @Get("{ticker}")
    public async getByTicker(
        @Path() ticker: string,
    ): Promise<Bsv20> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`SELECT b.*, a.accounts, u.unconfirmed
            FROM bsv20 b
            JOIN (SELECT COUNT(DISTINCT lock) as accounts FROM bsv20_txos WHERE tick=$1 AND valid=true) a ON true
            JOIN (SELECT SUM(amt) as unconfirmed FROM bsv20_txos WHERE tick=$1 AND valid IS NULL) u ON true
            WHERE tick=$1
            ORDER BY height ASC, idx ASC, valid DESC
            LIMIT 1`,
            [ticker.toUpperCase()]
        )

        if (rows.length === 0) {
            throw new NotFound(`Ticker ${ticker} not found`)
        }
        const bsv20 = Bsv20.fromRow(rows[0]);

        return bsv20;
    }

    @Get("{ticker}/activity")
    public async getByTickerActivity(
        @Path() ticker: string,
        @Query() fromHeight: number = 0,
        @Query() fromIdx: number = 0,
        @Query() limit: number = 100,
        @Query() status = Status.ValidAndPending,
    ): Promise<Bsv20[]> {
        let where = '';
        switch(status) {
            case Status.Invalid:
                where = 'AND valid = FALSE'
                break
            case Status.Pending:
                where = 'AND valid IS NULL'
                break
            case Status.Valid:
                where = 'AND valid = TRUE'
                break
            case Status.ValidAndPending:
                where = 'AND (valid = TRUE OR valid IS NULL)'
        }
        const { rows } = await pool.query(`SELECT *
            FROM bsv20_txos
            WHERE tick=$1 AND (height > $2 OR (height=$2 AND idx > $3)) ${where}
            ORDER BY height ASC, idx ASC
            LIMIT $4`,
            [
                ticker.toUpperCase(),
                fromHeight,
                fromIdx,
                limit
            ]
        )

        if (rows.length === 0) {
            throw new NotFound(`Ticker ${ticker} not found`)
        }
        return rows.map(row => Bsv20.fromRow(row));
    }

    @Get("address/{address}")
    public async getByAddress(
        @Path() address: string,
        @Query() status = Status.ValidAndPending,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Bsv20[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        ).reverse().toString('hex');
        return this.getByLock(lock, status, limit, offset);
    }

    @Get("lock/{lock}")
    public async getByLock(
        @Path() lock: string,
        @Query() status = Status.ValidAndPending,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Bsv20[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let where = '';
        switch(status) {
            case Status.Invalid:
                where = 'AND valid = FALSE'
                break
            case Status.Pending:
                where = 'AND valid IS NULL'
                break
            case Status.Valid:
                where = 'AND valid = TRUE'
                break
            case Status.ValidAndPending:
                where = 'AND (valid = TRUE OR valid IS NULL)'
        }
        const { rows } = await pool.query(`SELECT * 
            FROM bsv20_txos 
            WHERE lock=$1 AND spend=decode('', 'hex') ${where}
            ORDER BY height DESC, idx DESC
            LIMIT $2 OFFSET $3`,
            [
                Buffer.from(lock, 'hex'),
                limit,
                offset
            ],
        )

        return rows.map(row => Bsv20.fromRow(row))
    }

    @Get("address/{address}/balance")
    public async getBalanceByAddress(
        @Path() address: string,
    ): Promise<{[tick: string]:number}> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        ).reverse().toString('hex')
        return this.getBalanceByLock(lock)
    }

    @Get("lock/{lock}/balance")
    public async getBalanceByLock(
        @Path() lock: string,
    ): Promise<{[tick: string]:number}> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`SELECT tick, SUM(amt)
            FROM bsv20_txos 
            WHERE lock=$1 AND spend=decode('', 'hex') AND 
                (valid = true OR valid IS NULL)
            GROUP BY tick`,
            [Buffer.from(lock, 'hex')],
        )

        return rows.reduce((acc, row) => {
            acc[row.tick] = parseInt(row.sum);
            return acc;
        }, {});
    }

    @Get("address/{address}/balance/sorted")
    public async getSortedBalanceByAddress(
        @Path() address: string,
        ): Promise<TokenBalance[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        ).reverse().toString('hex')
        return this.getSortedBalanceByLock(lock)
    }

    @Get("lock/{lock}/balance/sorted")
    public async getSortedBalanceByLock(
        @Path() lock: string,
    ): Promise<TokenBalance[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

        const { rows } = await pool.query(`SELECT tick, listing, valid, SUM(amt) as amt
            FROM bsv20_txos 
            WHERE lock=$1 AND spend=decode('', 'hex') AND 
                (valid = true OR valid IS NULL) AND
                op != 'deploy'
            GROUP BY tick, listing, valid`,
            [Buffer.from(lock, 'hex')],
        )

        // console.log("BALANCE ROWS:", rows)
        const results: {[ticker: string]:TokenBalance} = {};
        for (let row of rows) {
            let tick = results[row.tick]
            if(!tick) {
                tick = new TokenBalance(row.tick)
                results[row.tick] = tick
            }

            const amt = parseInt(row.amt, 10)
            if(row.valid) {
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