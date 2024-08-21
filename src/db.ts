import { JungleBusClient } from "@gorillapool/js-junglebus";
import createError, { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';
import { Transaction } from "@bsv/sdk";
import { BlockHeader } from "@ts-bitcoin/core";

const { POSTGRES_FULL, BITCOIN_HOST, BITCOIN_PORT, JUNGLEBUS, REDISDB, REDISCACHE } = process.env;
export const jb = new JungleBusClient(JUNGLEBUS || 'https://junglebus.gorillapool.io');
const cparts = (REDISCACHE || '').split(':')
export const cache = new Redis({
    port: cparts[1] ? parseInt(cparts[1]) : 6379,
    host: cparts[0],
});

const rparts = (REDISDB || '').split(':')
export const redis = new Redis({
    port: rparts[1] ? parseInt(rparts[1]) : 6379,
    host: rparts[0],
});

const POSTGRES = POSTGRES_FULL
console.log("POSTGRES", POSTGRES)

export const pool = new Pool({ connectionString: POSTGRES });

export async function getChainTip(): Promise<BlockHeader> {
    let chaintip = await cache.get('chaintip');
    if (!chaintip) {
        const resp = await fetch(`${JUNGLEBUS}/v1/block_header/tip`);
        chaintip = await resp.text()
        await cache.setex('chaintip', chaintip, 15);
    }
    return JSON.parse(chaintip) as BlockHeader;
}

export async function loadRawtx(txid: string): Promise<Buffer> {
    let rawtx = await cache.hgetBuffer('tx', txid).catch(console.error);

    if (!rawtx) {
        const url = `${JUNGLEBUS}/v1/transaction/get/${txid}/bin`
        const resp = await fetch(url);
        if (resp.ok && resp.status == 200) {
            const buf = await resp.arrayBuffer();
            if (buf.byteLength > 0) {
                rawtx = Buffer.from(buf);
                await cache.hset('tx', txid, rawtx);
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
                await cache.hset('tx', txid, rawtx);
            }
        } else console.error('Node error:', txid, resp.status, resp.statusText)
    }

    if (rawtx) return rawtx;
    throw new NotFound(`${txid} not found`);
}

export async function loadTx(txid: string): Promise<Transaction> {
    const rawtx = await loadRawtx(txid);
    return Transaction.fromBinary([...rawtx]);
}


export async function loadProof(txid: string): Promise<Buffer> {
    let proof: Buffer | null = null
    // console.log("from cache", rawtx?.toString('hex'))
    try {
        proof = await cache.hgetBuffer('proof', txid);
    } catch (e) {
        console.log('Fetch from redis error:', txid, e)
    }

    try {
        
        let url = `${JUNGLEBUS}/v1/transaction/proof/${txid}/bin`
        let resp = await fetch(url);
        if (!resp.ok) {
            throw createError(resp.status, resp.statusText)
        }

        if (resp.status == 200) {
            proof = Buffer.from(await resp.arrayBuffer())
            if (proof.byteLength > 0) {
                await cache.hset('proof', txid, proof)
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