import { Address, Hash } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { pool } from "../db";
import { Bsv20 } from "../models/bsv20";

enum Status {
    Invalid = 0,
    Valid = 1,
    Pending = 2,
    ValidAndPending = 3,
    All = 4,
}

@Route("api/bsv20")
export class FungiblesController extends Controller {
    @Get("")
    public async getRecent(
        @Query() status = Status.ValidAndPending,
        @Query() limit: number = 100,
        @Query() offset: number = 0
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
            ORDER BY height DESC, idx DESC
            LIMIT $1 OFFSET $2`,
            [
                limit,
                offset
            ]
        )
        return rows.map(row => Bsv20.fromRow(row));
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
        const { rows } = await pool.query(`SELECT b.* FROM bsv20 b
            WHERE tick=UPPER($1)
            ORDER BY height ASC, idx ASC
            LIMIT 1`,
            [ticker]
        )

        if (rows.length === 0) {
            throw new NotFound(`Ticker ${ticker} not found`)
        }
        const bsv20 = Bsv20.fromRow(rows[0]);

        const { rows: [{accounts}] } = await pool.query(`SELECT COUNT(DISTINCT lock) as accounts
            FROM bsv20_txos
            WHERE tick=UPPER($1) AND valid=true`, [ticker]);
        bsv20.accounts = accounts;
        return bsv20;
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
        )
            .reverse()
            .toString('hex')
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
}