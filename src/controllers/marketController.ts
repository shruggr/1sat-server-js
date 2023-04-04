import { Controller, Get, Path, Route } from "tsoa";
import { Listing } from "../models/listing";
import { Outpoint } from '../models/outpoint';

@Route("api/market")
export class MarketController extends Controller {
    @Get("")
    public async getOpenListings(): Promise<Listing[]> {
        return Listing.loadOpenListings();
    }

    @Get("{outpoint}")
    public async getByAddress(@Path() outpoint: string): Promise<Listing> {
        return Listing.loadOneByOutpoint(Outpoint.fromString(outpoint));
    }
}