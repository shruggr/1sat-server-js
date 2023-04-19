import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Route } from "tsoa";
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

    @Get("recent/{page}")
    public async getRecentListings(
        @Path() page: number,
    ): Promise<Inscription[]> {
        return Listing.loadRecentListings(page);
    }

    @Get("{outpoint}")
    public async getByOutpoint(@Path() outpoint: string): Promise<Listing> {
        const listing = await Listing.loadOneByOutpoint(Outpoint.fromString(outpoint));
        const txnData = await jb.GetTransaction(listing.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        listing.script = tx.txOuts[listing.vout].script.toHex();
        return listing
    }
}