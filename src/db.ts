import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx, TxOut } from '@ts-bitcoin/core';
import createError, { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';
import { Outpoint } from "./models/outpoint";
// import {PreviousOutput} from 'bitcoin-ef/dist/typescript-npm-package.esm'

const { POSTGRES_READ, BITCOIN_HOST, BITCOIN_PORT, JUNGLEBUS, REDIS } = process.env;
export const jb = new JungleBusClient(JUNGLEBUS || 'http://junglebus.gorillapool.io');
const rparts = (REDIS || '').split(':')
export const redis = new Redis({
    port: rparts[1] ? parseInt(rparts[1]) : 6379,
    host: rparts[0],
});
console.log("POSTGRES", POSTGRES_READ)

export const pool = new Pool({ connectionString: POSTGRES_READ});

export async function loadTx(txid: string): Promise<Tx> {
    let rawtx = await redis.hgetBuffer('tx', txid);
    if (!rawtx) {
        try {
            const url = `${JUNGLEBUS}/v1/transaction/get/${txid}/bin`
            const resp = await fetch(url);
            if(!resp.ok) {
                throw createError(resp.status, resp.statusText)
            }

            if(resp.status >= 200 && resp.status < 300) {
                await redis.hset('tx', txid, Buffer.from(await resp.arrayBuffer()))
            }
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
            if(resp.status >= 200 && resp.status < 300) {
                await redis.hset('tx', txid, Buffer.from(await resp.arrayBuffer()))
            }
        } catch {
            console.log('Fetch from node error:', txid)
        }
    }

    if (!rawtx) {
        throw new NotFound(`Transaction ${txid} not found`);
    }
    return Tx.fromBuffer(rawtx);
}

export async function loadTxo(op: Outpoint): Promise<any> {
    let rawtx = await redis.hgetBuffer('tx', op.txid.toString('hex'));
    if (rawtx) {
        const tx = Tx.fromBuffer(rawtx);
        return {
            lockingScript: tx.txOuts[op.vout].script.toBuffer(),
            satoshis: tx.txOuts[op.vout].valueBn.toNumber()
        }
    }
    const url = `${JUNGLEBUS}/v1/txo/get/${op.toString()}`
    const resp = await fetch(url);
    if(!resp.ok) {
        throw createError(resp.status, resp.statusText)
    }
    const txOut = TxOut.fromBuffer(Buffer.from(await resp.arrayBuffer()));
    return {
        lockingScript: txOut.script.toBuffer(),
        satoshis: txOut.valueBn.toNumber()
    }
}