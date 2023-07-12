import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Body, BodyProp, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { BadRequest, NotFound } from 'http-errors';
import { Inscription, InscriptionSort } from "./../models/inscription";
import { Outpoint } from "./../models/outpoint";
import { Txo } from "../models/txo";
import { pool } from "../db";
import { Tx } from '@ts-bitcoin/core'
import { SortDirection } from "../models/listing";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');

@Route("api/inscriptions")
export class InscriptionsController extends Controller {
    @Get("origin/{origin}")
    public async getByOrigin(@Path() origin: string): Promise<Inscription[]> {
        return Inscription.loadByOrigin(Outpoint.fromString(origin));
    }

    @Get("origin/{origin}/latest")
    public async getOneByOrigin(@Path() origin: string): Promise<Inscription> {
        const outpoint = Outpoint.fromString(origin)
        const { rows } = await pool.query(`
            SELECT i.num, t.txid, t.vout, i.filehash, i.filesize, i.filetype, t.origin, t.height, t.idx, t.lock, t.spend, i.map, t.listing, l.price, l.payout, i.sigma, t.bsv20
            FROM txos t
            JOIN inscriptions i ON i.origin=t.origin
            LEFT JOIN ordinal_lock_listings l ON l.txid=t.txid AND l.vout=t.vout
            WHERE t.origin=$1
            ORDER BY t.height DESC, t.idx DESC
            LIMIT 1`,
            [outpoint.toBuffer()],
        );
        if(!rows.length) {
            throw new NotFound('Inscription not found');
        }
        return Inscription.fromRow(rows[0]);
    }

    @Get("origin/{origin}/metadata")
    public async getMetadataByOrigin(@Path() origin: string): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'public,immutable,max-age=31536000')
        return Inscription.loadMetadataByOrigin(Outpoint.fromString(origin));
    }

    @Get("origin/{origin}/history")
    public async getOriginHistory(@Path() origin: string): Promise<Inscription[]> {
        const outpoint = Outpoint.fromString(origin)
        return Inscription.loadInscriptions(
            [outpoint.toBuffer()],
            't.origin=$1',
            't.height, t.idx',
        );
    }

    @Post("outpoints")
    public async getInsByOutpoints(
        @Body() outpoints: string[]
    ): Promise<Inscription[]> {
        if (!outpoints.length || outpoints.length > 100) throw new BadRequest();
        let wheres: string[] = [];
        let params: any[] = [];
        outpoints.forEach((o, i) => {
            let outpoint = Outpoint.fromString(o);
            wheres.push(`($${params.length+1}, $${params.length+2})`)
            params.push(outpoint.txid, outpoint.vout)
        });
        const where = `(t.txid, t.vout) IN (${wheres.join(',')})`;
        return Inscription.loadInscriptions(params, where);
    }

    @Get("outpoint/{outpoint}")
    public async getInsByOutpoint(@Path() outpoint: string): Promise<Inscription> {
        this.setHeader('Cache-Control', 'public,immutable,max-age=31536000')
        const ins = await Txo.loadInscriptionByOutpoint(Outpoint.fromString(outpoint));
        const txnData = await jb.GetTransaction(ins.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        ins.script = tx.txOuts[ins.vout].script.toBuffer().toString('base64');
        return ins;
    }

    @Get("txid/{txid}")
    public async getByTxid(@Path() txid: string): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'public,immutable,max-age=31536000')
        return Inscription.loadByTxid(Buffer.from(txid, 'hex'));
    }

    @Get("count")
    public async getCount(): Promise<{count: number}> {
        const count = await Inscription.count();
        return { count };
    }

    @Get("{id}")
    public async getOneById(@Path() id: number): Promise<Inscription> {
        return Inscription.loadOneById(id);
    }

    @Post("search/text")
    public async searchText(
        @BodyProp() query: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.desc,
    ): Promise<Inscription[]> {
        return Inscription.loadInscriptions(
            [query], 
            `i.search_text_en @@ plainto_tsquery('english', $1)`, 
            `i.height ${dir}, i.idx ${dir}`, 
            limit, 
            offset,
        );
    }

    @Post("search/map")
    public async searchMap(
        @BodyProp() query: {[key: string]: any},
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() sort: InscriptionSort = InscriptionSort.none,
        @Query() dir: SortDirection = SortDirection.desc,
    ): Promise<Inscription[]> {
        let orderBy = '';
        switch(sort) {
            case InscriptionSort.listing:
                orderBy += `t.listing ${dir}, i.height ASC`;
                break;
            default:
                orderBy += `i.height ${dir}, i.idx ${dir}`;
        }
        return Inscription.loadInscriptions(
            [JSON.stringify(query)], 
            `i.map @> $1 AND t.spend=decode('', 'hex')`, 
            orderBy, 
            limit, 
            offset,
        );
    }

    @Get("sigma/{address}")
    public async searchSigma(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        const rows = await pool.query(`SELECT * FROM inscriptions
            WHERE sigma @> $1
            ORDER BY height DESC, idx DESC
            LIMIT $2 OFFSET $3`,
            [JSON.stringify([{
                address,
                valid: true
            }]) , limit, offset]
        )
        return rows.rows.map(row => Inscription.fromRow(row));
    }

    // @Get("geohash/{geohash}")
    // public async searchGeohash(
    //     @Path() geohash: string,
    // ): Promise<Inscription[]> {
    //     const rows = await pool.query(`SELECT * FROM inscriptions
    //         WHERE geohash LIKE $1`,
    //         [`${geohash}%`]
    //     )
    //     return rows.rows.map(row => Inscription.fromRow(row));
    // }

    @Get("geohash/{geohashes}")
    public async searchGeohashes(
        @Path() geohashes: string,
    ): Promise<Inscription[]> {
        const params: string[] = []
        const hashes: string[] = geohashes.split(',')
        if(!hashes.length) {
            throw new BadRequest();
        }
        const where: string[] = []
        hashes.forEach(h => {
            params.push(`${h}%`)
            where.push(`geohash LIKE $${params.length}`)
        })
        const rows = await pool.query(`SELECT * FROM inscriptions
            WHERE ${where.join(' OR ')}`,
            params
        )
        return rows.rows.map(row => Inscription.fromRow(row));
    }
}