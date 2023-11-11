
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { loadTx, pool } from "../db";
import { Txo } from "../models/txo";
import { TxoData } from "../models/txo";
import { SortDirection } from "../models/sort-direction";
import { Outpoint } from "../models/outpoint";
import { BadRequest } from "http-errors";

@Route("api/inscriptions")
export class InscriptionsController extends Controller {
    @Get("search")
    public async getInscriptionSearch(
        @Query() q?: string,
        @Query() sort?: SortDirection,
        @Query() limit: number = 100,
        @Query() offset: number = 0

    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        return this.search(query, sort, limit, offset);
    }

    /**
   * Inscription search. This is really powerful
   *  here are some really cool things you can do:
   * 
   * Search first-is-first: Set the sort=ASC, limit=1, offet=0
   * 
   */
    @Post("search")
    public async postInscriptionSearch(
        @Body() query?: TxoData,
        @Query() sort?: SortDirection,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        console.log("POST search")
        return this.search(query, sort, limit, offset);
    }

    @Get("recent")
    public async getRecentInscriptions(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return this.search(undefined, SortDirection.DESC, limit, offset);
    }

    @Get("txid/{txid}")
    public async getInscriptionsByTxid(
        @Path() txid: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const params: any[] = [Buffer.from(txid, 'hex')];
        let sql = `SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.txid=$1`;

        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    public async search(query?: TxoData, sort?: SortDirection, limit = 100, offset = 0): Promise<Txo[]> {
        if ((query as any)?.txid !== undefined) throw BadRequest('This is not a valid query. Reach out on 1sat discord for assistance.')
        const params: any[] = [];
        let sql = `SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin `;

        if (query) {
            params.push(JSON.stringify(query));
            sql += `WHERE t.data @> $${params.length} `
        }

        if (sort) {
            sql += `ORDER BY t.height ${sort}, t.idx ${sort} `
        }

        params.push(limit);
        sql += `LIMIT $${params.length} `
        params.push(offset);
        sql += `OFFSET $${params.length} `

        // console.log(sql, params)
        const { rows } = await pool.query(sql, params);
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("geohash/{geohashes}")
    public async searchGeohashes(
        @Path() geohashes: string,
    ): Promise<Txo[]> {
        const params: string[] = []
        const hashes: string[] = geohashes.split(',')
        if (!hashes.length) {
            throw new BadRequest();
        }
        const where: string[] = []
        hashes.forEach(h => {
            params.push(`${h}%`)
            where.push(`t.geohash LIKE $${params.length}`)
        })
        const { rows } = await pool.query(`SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE ${where.join(' OR ')}`,
            params
        )
        return rows.map(row => Txo.fromRow(row));
    }

    @Get("{outpoint}")
    public async getTxoByOutpoint(
        @Path() outpoint: string,
        @Query() script = false
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const txo = await Txo.loadByOutpoint(Outpoint.fromString(outpoint));
        if (script) {
            const tx = await loadTx(txo.txid);
            txo.script = tx.txOuts[txo.vout].script.toBuffer().toString('base64');
        }
        return txo
    }

    @Get("{origin}/latest")
    public async getLatestByOrigin(
        @Path() origin: string,
        @Query() script = false
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows: [lastest] } = await pool.query(`
            SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.origin = $1
            ORDER BY t.height DESC, t.idx DESC
            LIMIT 1`,
            [Outpoint.fromString(origin).toBuffer()]
        );

        const txo = Txo.fromRow(lastest);
        if (script) {
            const tx = await loadTx(txo.txid);
            txo.script = tx.txOuts[txo.vout].script.toBuffer().toString('base64');
        }
        return txo;
    }

    @Post("latest")
    public async getLatestByOrigins(
        @Body() origins: string[]
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        if (origins.length > 100) {
            throw new BadRequest('Too many origins');
        }
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.origin = ANY($1) and t.spend='\\x'`,
            [origins.map(o => Outpoint.fromString(o).toBuffer())]
        );

        return rows.map(Txo.fromRow);
    }
}