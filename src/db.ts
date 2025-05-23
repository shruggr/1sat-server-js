import { JungleBusClient } from "@gorillapool/js-junglebus";
import { NotFound } from 'http-errors';
import { Redis } from "ioredis";
import { Pool } from 'pg';
import { MerklePath, Transaction, Utils } from "@bsv/sdk";
import { BlockHeader } from "./models/block";

const { POSTGRES_FULL, BITCOIN_HOST, BITCOIN_PORT, JUNGLEBUS, REDISDB, REDISCACHE, HEADERS } = process.env;
export const jb = new JungleBusClient(JUNGLEBUS || 'https://junglebus.gorillapool.io');
const cparts = (REDISCACHE || '').split(':')

export let cache: Redis = new Redis({
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
    const resp = await fetch(`${HEADERS}/api/v1/chain/tip/longest`);
    if (!resp.ok) {
        throw new Error(`Failed to fetch chain tip: ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    return {
        hash: data.header.hash,
        height: data.height,
        version: data.header.version,
        prevHash: data.header.prevBlockHash,
        merkleroot: data.header.merkleRoot,
        time: data.header.creationTimestamp,
        bits: data.header.difficultyTarget,
        nonce: data.header.nonce,
    } as BlockHeader;
}

export async function loadRawtx(txid: string): Promise<Buffer> {
    const cacheKey = `tx:${txid}`;
    let rawtx = await cache.getBuffer(cacheKey);

    if (!rawtx) {
        const url = `${JUNGLEBUS}/v1/transaction/get/${txid}/bin`
        const resp = await fetch(url);
        if (resp.ok && resp.status == 200) {
            const buf = await resp.arrayBuffer();
            if (buf.byteLength > 0) {
                rawtx = Buffer.from(buf);
                await cache.set(cacheKey, rawtx);
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
                await cache.set(cacheKey, rawtx);
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