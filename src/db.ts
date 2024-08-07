import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx, TxOut } from '@ts-bitcoin/core';
import createError, { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';
import { Outpoint } from "./models/outpoint";

const { POSTGRES_FULL, BITCOIN_HOST, BITCOIN_PORT, JUNGLEBUS, REDIS } = process.env;
export const jb = new JungleBusClient(JUNGLEBUS || 'https://junglebus.gorillapool.io');
const rparts = (REDIS || '').split(':')
export const redis = new Redis({
    port: rparts[1] ? parseInt(rparts[1]) : 6379,
    host: rparts[0],
});
const POSTGRES = POSTGRES_FULL
console.log("POSTGRES", POSTGRES)

export const pool = new Pool({ connectionString: POSTGRES });

export async function loadRawtx(txid: string): Promise<Buffer> {
    let rawtx = await redis.hgetBuffer('tx', txid).catch(console.error);

    if (!rawtx) {
        const url = `${JUNGLEBUS}/v1/transaction/get/${txid}/bin`
        const resp = await fetch(url);
        if (resp.ok && resp.status == 200) {
            const buf = await resp.arrayBuffer();
            if (buf.byteLength > 0) {
                rawtx = Buffer.from(buf);
                await redis.hset('tx', txid, rawtx);
            }
        } else console.error('JB error:', txid, resp.status, resp.statusText)
    }

    if (!rawtx && BITCOIN_HOST) {
        const url = `http://${BITCOIN_HOST}:${BITCOIN_PORT}/rest/tx/${txid}.bin`
        const resp = await fetch(url);
        if (resp.ok && resp.status == 200) {
            const buf = await resp.arrayBuffer();
            if (buf.byteLength > 0) {
                rawtx = Buffer.from(buf);
                await redis.hset('tx', txid, rawtx);
            }
        } else console.error('Node error:', txid, resp.status, resp.statusText)
    }

    if (rawtx) return rawtx;
    throw new NotFound(`${txid} not found`);
}

export async function loadTx(txid: string): Promise<Tx> {
    const rawtx = await loadRawtx(txid);
    return Tx.fromBuffer(rawtx);
}


export async function loadProof(txid: string): Promise<Buffer> {
    let proof: Buffer | null = null
    // console.log("from cache", rawtx?.toString('hex'))
    try {
        proof = await redis.hgetBuffer('proof', txid);
    } catch (e) {
        console.log('Fetch from redis error:', txid, e)
    }

    try {
        
        let url = `${JUNGLEBUS}/v1/transaction/proof/${txid}`
        let resp = await fetch(url);
        if (!resp.ok) {
            throw createError(resp.status, resp.statusText)
        }

        if (resp.status == 200) {
            proof = Buffer.from(await resp.arrayBuffer())
            if (proof.byteLength > 0) {
                await redis.hset('proof', txid, proof)
            }
        }
    } catch (e) {
        console.log('Fetch from node error:', txid, e)
    }

    if (!proof) {
        throw new NotFound(`${txid} not found`);
    }
    return proof;
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
    if (!resp.ok) {
        throw createError(resp.status, resp.statusText)
    }
    const txOut = TxOut.fromBuffer(Buffer.from(await resp.arrayBuffer()));
    return {
        lockingScript: txOut.script.toBuffer(),
        satoshis: txOut.valueBn.toNumber()
    }
}