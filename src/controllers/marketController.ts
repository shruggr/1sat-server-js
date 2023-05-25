import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { Listing, ListingSort, SortDirection } from "../models/listing";
import { Outpoint } from '../models/outpoint';
import { Inscription } from "../models/inscription";
import { pool } from "../db";

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
        const { rows } = await pool.query(`
            SELECT l.num as id, l.txid, l.vout, i.filehash, i.filesize, i.filetype, i.origin, l.height, l.idx, t.lock, l.spend, i.map, true as listing, l.price, l.payout
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

    @Get("bsv20")
    public async getOpenBsv20(
        @Query() sort: ListingSort = ListingSort.recent,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
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
        const { rows } = await pool.query(`
            SELECT b.*, l.price, l.payout
            FROM ordinal_lock_listings l
            JOIN bsv20_txos b ON b.txid=l.txid AND b.vout=l.vout
            WHERE b.spend = decode('', 'hex')
            ${orderBy}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
        );
        return rows.map((r: any) => Inscription.fromRow(r));
    }

    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() bsv20: boolean = true,
    ): Promise<Inscription[]> {
        return this.getOpenListings(ListingSort.recent, SortDirection.desc, limit, offset);
    }

    @Get("{outpoint}")
    public async getByOutpoint(@Path() outpoint: string): Promise<Listing> {
        const listing = await Listing.loadOneByOutpoint(Outpoint.fromString(outpoint));
        const txnData = await jb.GetTransaction(listing.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        listing.script = tx.txOuts[listing.vout].script.toBuffer().toString('base64');
        return listing
    }
}