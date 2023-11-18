import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import createError, { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';

const { POSTGRES_FULL, BITCOIN_HOST, BITCOIN_PORT } = process.env;
export const jb = new JungleBusClient('https://junglebus.gorillapool.io');
export const redis = new Redis();
console.log("POSTGRES", POSTGRES_FULL)
export const pool = new Pool({ connectionString: POSTGRES_FULL});

export async function loadTx(txid: string): Promise<Tx> {
    let rawtx = await redis.getBuffer(txid);
    if (!rawtx) {
        try {
            const url = `http://junglebus.gorillapool.io/v1/transaction/get/${txid}.bin`
            const resp = await fetch(url);
            if(!resp.ok) {
                throw createError(resp.status, resp.statusText)
            }
            rawtx = Buffer.from(await resp.arrayBuffer());
            await redis.set(txid, rawtx)
        } catch {
            console.log('Fetch from JB error:', txid)
        }
    }
    if (!rawtx) {
        try {
            const url = `http://${BITCOIN_HOST}:${BITCOIN_PORT}/rest/tx/${txid}.bin`
            const resp = await fetch(url);
            if(!resp.ok) {
                throw createError(resp.status, resp.statusText)
            }
            rawtx = Buffer.from(await resp.arrayBuffer());
            await redis.set(txid, rawtx)
        } catch {
            console.log('Fetch from server error:', txid)
        }
    }

    if (!rawtx) {
        throw new NotFound(`Transaction ${txid} not found`);
    }
    return Tx.fromBuffer(rawtx);
}