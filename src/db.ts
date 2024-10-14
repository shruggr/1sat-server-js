import { JungleBusClient } from "@gorillapool/js-junglebus";
import { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';
import { MerklePath, Transaction, Utils } from "@bsv/sdk";
import { BlockHeader } from "./models/block";

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
    const chaintip = await redis.get('chaintip');
    return JSON.parse(chaintip!) as BlockHeader;
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

export async function loadTxWithProof(txid: string): Promise<number[]> {
    const [rawtx, proof] = await Promise.all([
        loadRawtx(txid).then(rawtx => [...rawtx] as number[]),
        loadProof(txid).then(proof => [...proof] as number[]).catch(() => [] as number[])
    ])
    
    const writer = new Utils.Writer();
    writer.writeVarIntNum(rawtx.length)
    writer.write(rawtx)
    writer.writeVarIntNum(proof.length)
    writer.write(proof)
    const resp = writer.toArray();
    console.log('GET TX:', txid, rawtx.length, proof.length, JSON.stringify(resp.slice(0, 10)))
    return resp;
}


export async function loadProof(txid: string): Promise<Buffer> {
    const cacheKey = `prf:${txid}`;
    let proof = await cache.getBuffer(cacheKey);
    if(!proof) {
        const resp = await fetch(`${JUNGLEBUS}/v1/transaction/proof/${txid}/bin`);
        if (!resp.ok) {
            // throw createError(resp.status, resp.statusText)
            throw new NotFound(`${txid} not found`);
        }
        proof = Buffer.from(await resp.arrayBuffer())
        const merklePath = MerklePath.fromBinary([...proof]);
        const chaintip = await getChainTip();
        if(merklePath.blockHeight < chaintip.height - 5) {
            await cache.set(cacheKey, proof)
        } else {
            await cache.setex(cacheKey, 60, proof)
        }
    }

    if (!proof) {
        throw new NotFound(`${txid} not found`);
    }
    return proof;
}