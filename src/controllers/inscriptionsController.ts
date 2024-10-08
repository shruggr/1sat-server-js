import { NotFound } from 'http-errors';
import * as createError from 'http-errors'
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { cache, loadTx, pool} from "../db";
import { Txo } from "../models/txo";
import { TxoData } from "../models/txo";
import { Outpoint } from "../models/outpoint";
import { BadRequest } from "http-errors";
import { SortDirection } from '../models/sort-direction';
import { Address } from '@ts-bitcoin/core';
import { Utils } from '@bsv/sdk';

const { INDEXER } = process.env;

interface TxidsResponse {
    txid: string;
    height: number;
    idx: number;
}

@Route("api/inscriptions")
export class InscriptionsController extends Controller {
    @Get("search")
    public async getInscriptionSearch(
        @Query() q?: string,
        @Query() tag?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let query: TxoData | undefined;
        if (q) {
            query = JSON.parse(Buffer.from(q, 'base64').toString('utf8'));
        }
        console.log("GET search", {query, limit, offset, dir})
        return Txo.search(false, query, tag, limit, offset, dir);
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
        @Query() tag?: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir?: SortDirection
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        console.log("POST search")
        return Txo.search(false, query, tag, limit, offset, dir);
    }

    @Get("recent")
    public async getRecentInscriptions(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            WHERE t.height IS NOT NULL
            ORDER BY t.height DESC, t.idx DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return rows.map((row: any) => Txo.fromRow(row));
    }

    @Get("txid/{txid}")
    public async getInscriptionsByTxid(
        @Path() txid: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'public,max-age=86400')
        return Txo.getByTxid(txid);
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
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
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
        this.setHeader('Cache-Control', 'public,max-age=86400')
        const txo = await Txo.getByOutpoint(Outpoint.fromString(outpoint));
        if (script) {
            const tx = await loadTx(txo.txid);
            txo.script = Utils.toBase64(tx.outputs[txo.vout].lockingScript.toBinary());
        }
        return txo
    }

    @Get("{outpoint}/ancestors")
    public async getAncestorsByOutpoint(
        @Path() outpoint: string,
    ): Promise<TxidsResponse[]> {
        this.setHeader('Cache-Control', 'public,max-age=86400')
        const { rows } = await pool.query(`
            SELECT o.txid, o.height, o.idx
            FROM txos t
            JOIN txos o ON o.origin = t.origin AND o.spend != '\\x'
            WHERE t.outpoint = $1
            ORDER BY o.height ASC, o.idx ASC`,
            [Outpoint.fromString(outpoint).toBuffer()]
        );

        return rows.map(r => ({
            txid: r.txid.toString('hex'),
            height: r.height,
            idx: r.idx
        }));
    }

    @Post("ancestors")
    public async getAncestorsByOutpoints(
        @Body() outpoints: string[]
    ): Promise<TxidsResponse[]> {
        if (outpoints.length > 100) {
            throw new BadRequest('Too many outpoints');
        }
        const { rows } = await pool.query(`
            SELECT o.txid, o.height, o.idx
            FROM txos t
            JOIN txos o ON o.origin = t.origin AND o.spend != '\\x'
            WHERE t.outpoint = ANY($1)
            ORDER BY o.height ASC, o.idx ASC`,
            [outpoints.map(o => Outpoint.fromString(o).toBuffer())]
        );

        return rows.map(r => ({
            txid: r.txid.toString('hex'),
            height: r.height,
            idx: r.idx
        }));
    }

    @Get("num/{num}")
    public async getTxoByNum(
        @Path() num: string,
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'public,max-age=86400')
        const { rows: [row] } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout, i.num as inum
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN inscriptions i ON i.height=o.height AND i.idx=o.idx AND i.vout=o.vout
            WHERE i.num = $1`,
            [num],
        );

        if (!row) {
            throw new NotFound();
        }
        return Txo.fromRow(row);
    }

    @Get("{origin}/latest")
    public async getLatestByOrigin(
        @Path() origin: string,
        @Query() script = false
    ): Promise<Txo> {
        this.setHeader('Cache-Control', 'public,immutable,max-age=10')
        
        const outpoint = await this.getLatest(origin);

        const sql = `SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            WHERE t.outpoint = $1`;

        const { rows: [latest] } = await pool.query(sql,
            [outpoint]
        );

        if (!latest) {
            throw new NotFound();
        }
        // console.log(sql, origin)
        const txo = Txo.fromRow(latest);
        if (script) {
            const tx = await loadTx(txo.txid);
            txo.script = Utils.toBase64(tx.outputs[txo.vout].lockingScript.toBinary());
        }
        return txo;
    }

    public async getLatest(origin: string): Promise<Buffer> {
        let outpoint = await cache.hgetBuffer('latest', origin);
        
        if (!outpoint) {
            console.log('Uncached latest', origin)
            outpoint = await this.callLatest(origin);
        } else {
            const refresh = await cache.set(`origin:${origin}:fresh`, Date.now(), 'EX', 15, 'NX')
            if (refresh == 'OK') {
                // console.log('Refreshing latest', origin, outpoint.toString('hex'))
                await this.callLatest(origin);
            // } else {
            //     console.log('Using cached latest', origin, outpoint.toString('hex'))
            }
        }
        
        return outpoint;
    }

    public async callLatest(origin: string): Promise<Buffer> {
        const url = `${INDEXER}/origin/${origin}/latest`
        const resp = await fetch(url)
        if (!resp.ok) {
            console.log("latest error:", resp.status, await resp.text())
            throw createError(resp.status, resp.statusText)
        }
        const outpoint = Buffer.from(await resp.arrayBuffer())
        cache.hset('latest', origin, outpoint);
        return outpoint;
    }

    @Get("address/{address}/ancestors")
    public async getOriginTxidsByAddress(
        @Path() address: string,
        @Query() limit: number = 1000,
        @Query() offset: number = 0,
    ): Promise<TxidsResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const add = Address.fromString(address);
        const { rows } = await pool.query(`
            SELECT o.txid, o.height, o.idx
            FROM txos t
            JOIN txos o ON o.origin = t.origin AND o.spend != '\\x'
            WHERE t.pkhash=$1 AND t.spend='\\x' AND t.origin IS NOT NULL
            ORDER BY o.height ASC, o.idx ASC
            LIMIT $2 OFFSET $3`,
            [add.hashBuf, limit, offset]
        );

        return rows.map(r => ({
            txid: r.txid.toString('hex'),
            height: r.height,
            idx: r.idx
        }));
    }

    @Get("{origin}/history")
    public async getHistoryByOrigin(
        @Path() origin: string,
    ): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            WHERE t.origin = $1
            ORDER BY t.height ASC, t.idx ASC, t.spend DESC`,
            [Outpoint.fromString(origin).toBuffer()]
        );

        return rows.map(r => Txo.fromRow(r));
    }

    @Get("{origin}/txids")
    public async getOriginTxids(
        @Path() origin: string,
    ): Promise<TxidsResponse[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`
            SELECT txid, height, idx
            FROM txos
            WHERE t.origin = $1
            ORDER BY t.height ASC, t.idx ASC`,
            [Outpoint.fromString(origin).toBuffer()]
        );

        return rows.map(r => ({
            txid: r.txid.toString('hex'),
            height: r.height,
            idx: r.idx
        }));
    }

    @Post("latest")
    public async getLatestByOrigins(
        @Body() origins: string[]
    ): Promise<Txo[]> {
        if (origins.length > 100) {
            throw new BadRequest('Too many origins');
        }
        const outpoints = await Promise.all(origins.map(o => this.getLatest(o)))
        const { rows } = await pool.query(`
            SELECT t.*, o.data as odata, o.height as oheight, o.idx as oidx, o.vout as ovout
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            WHERE t.outpoint = ANY($1)`,
            [outpoints]
        );

        return rows.map(Txo.fromRow);
    }
}