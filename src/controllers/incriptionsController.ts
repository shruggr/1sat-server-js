import { BodyProp, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { Inscription } from "./../models/inscription";
import { Outpoint } from "./../models/outpoint";
import { Txo } from "../models/txo";
import { pool } from "../db";

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

    @Get("outpoint/{outpoint}")
    public async getByOutpoint(@Path() outpoint: string): Promise<Inscription> {
        return Txo.loadInscriptionByOutpoint(Outpoint.fromString(outpoint));
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

    @Post("search/text")
    public async searchText(
        @BodyProp() query: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        const rows = await pool.query(`SELECT * FROM inscriptions
            WHERE search_text_en @@ plainto_tsquery('english', $1)
            ORDER BY height DESC, idx DESC
            DESC LIMIT $2 OFFSET $3`,
            [{ text: query }, limit, offset]
        )
        return rows.rows.map(row => Inscription.fromRow(row));
    }

    @Post("search/map")
    public async searchMap(
        @BodyProp() query: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0
    ): Promise<Inscription[]> {
        const rows = await pool.query(`SELECT * FROM inscriptions
            WHERE map @> $1
            ORDER BY height DESC, idx DESC
            DESC LIMIT $2 OFFSET $3`,
            [{ text: query }, limit, offset]
        )
        return rows.rows.map(row => Inscription.fromRow(row));
    }
}