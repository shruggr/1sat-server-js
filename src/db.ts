import { Pool } from 'pg';
import { Redis } from "ioredis";
import { Tx } from '@ts-bitcoin/core';
import { JungleBusClient } from "@gorillapool/js-junglebus";
import * as createError from 'http-errors';

const { POSTGRES } = process.env;
export const jb = new JungleBusClient('https://junglebus.gorillapool.io');
export const redis = new Redis();
export const pool = new Pool({ connectionString: POSTGRES});

export async function loadTx(txid: string): Promise<Tx> {
    let rawtx = await redis.getBuffer(txid);
    if (!rawtx) {
        const resp = await fetch(`https://junglebus.gorillapool.io/v1/transaction/get/${txid}/bin`);
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