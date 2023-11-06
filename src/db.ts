import { Pool } from 'pg';
import { Redis } from "ioredis";
import { Tx } from '@ts-bitcoin/core';
import { JungleBusClient } from "@gorillapool/js-junglebus";
import * as createError from 'http-errors';

const { POSTGRES_FULL, BITCOIN_HOST, BITCOIN_PORT } = process.env;
export const jb = new JungleBusClient('https://junglebus.gorillapool.io');
export const redis = new Redis();
console.log("POSTGRES", POSTGRES_FULL)
export const pool = new Pool({ connectionString: POSTGRES_FULL});

export async function loadTx(txid: string): Promise<Tx> {
    let rawtx = await redis.getBuffer(txid);
    if (!rawtx) {
        const url = `http://${BITCOIN_HOST}:${BITCOIN_PORT}/rest/tx/${txid}.bin`
        const resp = await fetch(url);
        if(!resp.ok) {
            throw createError(resp.status, resp.statusText)
        }
        rawtx = Buffer.from(await resp.arrayBuffer());
        await redis.set(txid, rawtx)
        // const jbtx = await jb.GetTransaction(txid);
        // if (!jbtx) {
        //     throw new NotFound(`Transaction ${txid} not found`);
        // }
        // rawtx = Buffer.from(jbtx.transaction, 'base64');
    }
    return Tx.fromBuffer(rawtx);
}