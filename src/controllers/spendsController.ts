import createError from "http-errors";
import { Body, Controller, Get, Path, Post, Route } from "tsoa";
// import { pool } from "../db";
import { Outpoint } from "../models/outpoint";
import { cache } from "../db";

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
        const cacheKey = `spend:${outpoint}`;
        let spend = await cache.getBuffer(cacheKey);
        if (!spend) {
            const resp = await fetch(`https://junglebus.gorillapool.io/v1/txo/spend/${op.toString()}`)
            if (!resp.ok) throw createError(resp.status, await resp.text());
            spend = Buffer.from(await resp.arrayBuffer());
            // console.log('Spend:', outpoint, spend.toString())
            if(spend?.length === 32) {
                await cache.setex(cacheKey, 60 * 60 * 24, spend);
                // pool.query('UPDATE txos SET spend=$2 WHERE outpoint=$1', [outpoint, spend]).catch(e => console.error("SpendErr: ", e));
            }
        };
        return spend.toString('hex');
    }

}