import { Pool } from 'pg';
import { Redis } from "ioredis";
import { Tx } from '@ts-bitcoin/core';
import { JungleBusClient } from "@gorillapool/js-junglebus";
import { NotFound } from 'http-errors';

const { POSTGRES } = process.env;
export const jb = new JungleBusClient('https://junglebus.gorillapool.io');
export const redis = new Redis();
export const pool = new Pool({ connectionString: POSTGRES});

export async function loadTx(txid: string): Promise<Tx> {
    let rawtx = await redis.getBuffer(txid);
    if (!rawtx) {
        const jbtx = await jb.GetTransaction(txid);
        if (!jbtx) {
            throw new NotFound(`Transaction ${txid} not found`);
        }
        rawtx = Buffer.from(jbtx.transaction, 'base64');
    }
    return Tx.fromBuffer(rawtx);
}