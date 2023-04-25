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
        return Listing.loadOpenListings();
    }

    @Get("recent")
    public async getRecentListings(
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        return Listing.loadRecentListings(limit, offset);
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