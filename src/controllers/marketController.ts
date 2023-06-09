import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { BodyProp, Controller, Deprecated, Get, Path, Post, Query, Route } from "tsoa";
import { ListingSort, SortDirection } from "../models/listing";
import { Outpoint } from '../models/outpoint';
import { Inscription } from "../models/inscription";
import { pool } from "../db";
import { Bsv20 } from "../models/bsv20";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');

@Route("api/market")
export class MarketController extends Controller {
    @Get("")
    public async getOpenListings(
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        // this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let orderBy = 'ORDER BY ';
        switch(sort) {
            case ListingSort.num:
                orderBy += `l.num ${dir}`;
                break;
            case ListingSort.price:
                orderBy += `l.price ${dir}`;
                break;
            default:
                orderBy += `l.height ${dir}, l.idx ${dir}`;
        }
        const { rows } = await pool.query(`
            SELECT l.num, l.txid, l.vout, i.filehash, i.filesize, i.filetype, i.origin, l.height, l.idx, t.lock, l.spend, i.map, true as listing, l.price, l.payout, i.sigma
            FROM ordinal_lock_listings l
            JOIN inscriptions i ON i.origin=l.origin
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            WHERE l.spend = decode('', 'hex') and l.bsv20 = false
            ${orderBy}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        return rows.map((r: any) => Inscription.fromRow(r));
    }

    @Post("search/map")
    public async searchMarketByMap(
        @BodyProp() query: {[key: string]: any},
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        let orderBy = 'ORDER BY ';
        switch(sort) {
            case ListingSort.num:
                orderBy += `l.num ${dir}`;
                break;
            case ListingSort.price:
                orderBy += `l.price ${dir}`;
                break;
            default:
                orderBy += `l.height ${dir}, l.idx ${dir}`;
        }
        const { rows } = await pool.query(`
            SELECT l.num, l.txid, l.vout, i.filehash, i.filesize, i.filetype, i.origin, l.height, l.idx, t.lock, l.spend, i.map, true as listing, l.price, l.payout, i.sigma
            FROM ordinal_lock_listings l
            JOIN inscriptions i ON i.origin=l.origin
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            WHERE l.spend = decode('', 'hex') and l.bsv20 = false AND i.map @> $3
            ${orderBy}
            LIMIT $1 OFFSET $2`,
            [limit, offset, JSON.stringify(query)],
        );
        return rows.map((r: any) => Inscription.fromRow(r));
    }

    @Get("bsv20")
    public async getOpenBsv20(
        @Query() tick: string = '',
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 1000,
        @Query() offset: number = 0
    ): Promise<Bsv20[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        let orderBy = 'ORDER BY ';
        switch(sort) {
            case ListingSort.num:
                orderBy += `l.num ${dir}`;
                break;
            case ListingSort.price:
                orderBy += `l.price ${dir}`;
                break;
            default:
                orderBy += `l.height ${dir}, l.idx ${dir}`;
        }
        const params: any[] = [limit, offset]
        if (tick) {
            params.push(tick.toUpperCase())
        }
        const { rows } = await pool.query(`
            SELECT b.*, l.price, l.payout
            FROM ordinal_lock_listings l
            JOIN bsv20_txos b ON b.txid=l.txid AND b.vout=l.vout AND b.valid=true
            WHERE b.spend = decode('', 'hex') ${tick ? `AND b.tick=$3` : ''}
            ${orderBy}
            LIMIT $1 OFFSET $2`,
            params,
        );
        return rows.map((r: any) => Bsv20.fromRow(r));
    }

    @Get("bsv20/{tick}")
    public async getOpenBsv20ByTicker(
        @Path() tick: string,
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Bsv20[]> {
        return this.getOpenBsv20(tick, sort, dir, limit, offset);
    }

    @Deprecated()
    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20: boolean = true,
    ): Promise<Inscription[]> {
        return this.getOpenListings(ListingSort.recent, SortDirection.desc, limit, offset);
    }

    @Get("{outpoint}")
    public async getByOutpoint(@Path() outpoint: string): Promise<Inscription> {
        const op = Outpoint.fromString(outpoint)
        // SELECT o.*, i.filehash, i.filesize, i.filetype, i.map, true as listing, i.sigma
        // FROM ordinal_lock_listings o
        // JOIN inscriptions i ON i.origin=o.origin

        const { rows } = await pool.query(`
            SELECT l.num, l.txid, l.vout, i.filehash, i.filesize, i.filetype, i.origin, l.height, l.idx, t.lock, l.spend, i.map, true as listing, l.price, l.payout, i.sigma
            FROM ordinal_lock_listings l
            JOIN inscriptions i ON i.origin=l.origin
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            WHERE l.txid=$1 AND l.vout=$2`,
            [op.txid, op.vout]
        );
        const listing = Inscription.fromRow(rows[0])
        // const listing = await Listing.loadOneByOutpoint(Outpoint.fromString(outpoint));
        const txnData = await jb.GetTransaction(listing.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        listing.script = tx.txOuts[listing.vout].script.toBuffer().toString('base64');
        return listing
    }
}