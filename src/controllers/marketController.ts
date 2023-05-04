import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { Listing } from "../models/listing";
import { Outpoint } from '../models/outpoint';
import { Inscription } from "../models/inscription";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');

@Route("api/market")
export class MarketController extends Controller {
    @Get("")
    public async getOpenListings(): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadOpenListings();
    }

    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadRecentListings(limit, offset);
    }

    @Get("num/asc")
    public async getListingsByNumAsc(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadListingsByNum(limit, offset, 'ASC');
    }

    @Get("num/desc")
    public async getListingsByNumDesc(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadListingsByNum(limit, offset, 'DESC');
    }

    @Get("price/asc")
    public async getListingsByPriceAsc(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadListingsByPrice(limit, offset, 'ASC');
    }

    @Get("price/desc")
    public async getListingsByPriceDesc(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Listing.loadListingsByPrice(limit, offset, 'DESC');
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