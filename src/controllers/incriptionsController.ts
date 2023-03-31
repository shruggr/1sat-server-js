import { Controller, Get, Path, Route } from "tsoa";
import { Inscription, Outpoint } from "../models";

@Route("api/inscriptions")
export class InscriptionsController extends Controller {
    @Get("origin/{origin}")
    public async getByOrigin(@Path() origin: string): Promise<Inscription[]> {
        return Inscription.loadByOrigin(Outpoint.fromString(origin));
    }

    @Get("origin/{origin}/latest")
    public async getOneByOrigin(@Path() origin: string): Promise<Inscription> {
        return Inscription.loadOneByOrigin(Outpoint.fromString(origin));
    }

    @Get("origin/{origin}/metadata")
    public async getMetadataByOrigin(@Path() origin: string): Promise<Inscription[]> {
        return Inscription.loadMetadataByOrigin(Outpoint.fromString(origin));
    }

    @Get("txid/{txid}")
    public async getByTxid(@Path() txid: string): Promise<Inscription[]> {
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
}