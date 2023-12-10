import createError from "http-errors";
import { Body, Controller, Get, Path, Post, Route } from "tsoa";
// import { pool } from "../db";
import { Outpoint } from "../models/outpoint";

@Route("api/spends")
export class SPendsController extends Controller {
    @Get(":outpoint")
    public async getSpend(
        @Path() outpoint: string,
    ): Promise<string> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const spend = await this.lookupSpend(outpoint);
        return spend;
    }

    @Post("")
    public async getSpends(
        @Body() outpoints: string[],
    ): Promise<string[]> {
        return Promise.all(outpoints.map((op) => this.lookupSpend(op)));
    }

    private async lookupSpend(outpoint: string): Promise<string> {
        const op = Outpoint.fromString(outpoint);
        const resp = await fetch(`https://junglebus.gorillapool.io/v1/txo/spend/${op.toString()}`)
        if (!resp.ok) throw createError(resp.status, await resp.text());
        const spend = Buffer.from(await resp.arrayBuffer());
        // console.log('Spend:', outpoint, spend.toString())
        if(spend && spend.length != 32) {
            // pool.query('UPDATE txos SET spend=$2 WHERE outpoint=$1', [outpoint, spend]).catch(e => console.error("SpendErr: ", e));
        }
        return spend.toString('hex');
    }

}