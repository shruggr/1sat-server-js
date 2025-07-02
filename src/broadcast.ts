import { Transaction } from "@bsv/sdk";
import * as createError from "http-errors";
import { cache, redis } from "./db";

const { NETWORK, ARC, ARC_AUTH_TOKEN, ARC_CALLBACK_URL, ARC_CALLBACK_TOKEN, INDEXER } = process.env;

export async function broadcastTx(tx: Transaction): Promise<string> {
    let txid = tx.id('hex') as string;
    console.time('Broadcast: ' + txid)
    // console.timeLog('Broadcast: ' + txid, txbuf.toString('hex'))
    const txbuf = Buffer.from(tx.toBinary())
    await cache.set(`tx:${txid}`, txbuf)
    try {
        if (NETWORK == 'testnet') {
            try {
                await broadcastWOC(tx);
                broadcastArc(tx).catch(console.error)
            } catch (e: any) {
                if (e.status && e.status >= 300 && e.status < 500) {
                    throw e;
                }
                await broadcastArc(tx);
            }
        } else {
            await broadcastArc(tx);
        }

        console.timeLog('Broadcast: ' + txid, "Publishing to redis")
        await fetch(`${INDEXER}/tx/${txid}/ingest`).catch((e) => console.error("Ingestion error:", e))
        await redis.publish("broadcast", txbuf.toString('base64'))
        return txid;
    } catch (e: any) {
        console.error("Broadcast Error:", e)
        throw e;
    } finally {
        console.timeEnd('Broadcast: ' + txid)
    }
}

export async function broadcastWOC(tx: Transaction) {
    const net = NETWORK == 'testnet' ? 'test' : 'main'
    const resp = await fetch(`https://api.whatsonchain.com/v1/bsv/${net}/tx/raw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txhex: tx.toHex() })
    });

    const respText = await resp.text();
    console.log("WOC Response:", resp.status, respText);
    if (!resp.ok) {
        try {
            // const { status, error } = JSON.parse(respText);
            // if (!error.includes('txn-already-known')) {
            throw createError(resp.status || 500, `Broadcast failed: ${respText}}`);
            // }
        } catch (e: any) {
            throw e;
        }
    }
}

export async function broadcastArc(tx: Transaction) {
    // let txbuf: Buffer
    // try {
    //     await Promise.all(tx.inputs.map(async txIn => {
    //         if (txIn.sourceTransaction) return
    //         txIn.sourceTransaction = await loadTx(txIn.sourceTXID!)
    //     }))
    //     txbuf = Buffer.from(tx.toEF());
    // } catch (e) {
    //     console.error("Error loading txos", tx.id('hex'), e)
    //     txbuf = Buffer.from(tx.toBinary());
    // }

    const txbuf = Buffer.from(tx.toBinary());
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/octet-stream',
        'X-WaitFor': 'SEEN_ON_NETWORK',
        'X-MaxTimeout': '30',
        'X-FullStatusUpdates': 'true',
    }
    if (ARC_CALLBACK_URL) {
        headers['X-CallbackUrl'] = ARC_CALLBACK_URL;
    }
    if (ARC_CALLBACK_TOKEN) {
        headers['X-CallbackToken'] = ARC_CALLBACK_TOKEN;
    }
    if (ARC_AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${ARC_AUTH_TOKEN}`
    }
    const logLabel = 'ARC Broadcast: ' + tx.id('hex')
    console.time(logLabel)
    console.timeLog(logLabel, "headers:", JSON.stringify(headers))
    const resp = await fetch(`${ARC}/v1/tx`, {
        method: 'POST',
        headers,
        body: txbuf,
    })
    const respText = await resp.text();
    console.timeLog(logLabel, resp.status, respText)
    const result = JSON.parse(respText)
    if (result.status != 200 || result.txStatus == 'REJECTED') {
        throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
    } else if(result.txStatus == 'DOUBLE_SPEND_ATTEMPTED') {
        console.warn("Double-spend attempt:", tx.id('hex'), "competing with", result.competingTxs);
        throw createError(409, `"Double-spend attempt: ${result.extraInfo}`);
    } else if(result.txStatus == 'SEEN_IN_ORPHAN_MEMPOOL') {
        console.warn("Orphaned transaction:", tx.id('hex'), result.extraInfo);
        throw createError(409, `Orphaned transaction: ${result.extraInfo}`);
    }
}
