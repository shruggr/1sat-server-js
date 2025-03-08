import { Transaction } from "@bsv/sdk";
import * as createError from "http-errors";
import { cache, loadTx, redis } from "../db";

const { NETWORK, TAAL_TOKEN, ARC_TOKEN, ARC, INDEXER } = process.env;

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
        } else if (TAAL_TOKEN) {
            console.timeLog('Broadcast: ' + txid, "Broadcasting to TAAL")
            await broadcastTaal(tx);
            console.timeLog('Broadcast: ' + txid, "Broadcasting to ARC")
            broadcastArc(tx).catch(console.error)
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

export async function broadcastTaal(tx: Transaction) {
    const resp = await fetch('https://api.taal.com/api/v1/broadcast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': TAAL_TOKEN!
        },
        body: Buffer.from(tx.toBinary())
    });

    const respText = await resp.text();
    console.log("TAAL Response:", tx.id('hex'), resp.status, respText, new Date().toISOString());
    if (!resp.ok) {
        try {
            const { status, error } = JSON.parse(respText);
            if (!error.includes('txn-already-known')) {
                throw createError(status || resp.status || 500, `Broadcast failed: ${error}`);
            }
        } catch (e: any) {
            throw e;
        }
    }
}

export async function broadcastArc(tx: Transaction) {
    let txbuf: Buffer
    try {
        await Promise.all(tx.inputs.map(async txIn => {
            if (txIn.sourceTransaction) return
            txIn.sourceTransaction = await loadTx(txIn.sourceTXID!)
        }))
        txbuf = Buffer.from(tx.toEF());
        // txbuf = StandardToExtended(tx.toBuffer(), parents) as Buffer
        // console.error("ARC EXT:", txbuf.toString('hex'), parents)
    } catch (e) {
        console.error("Error loading txos", tx.id('hex'), e)
        txbuf = Buffer.from(tx.toBinary());
    }

    const headers: { [key: string]: string } = {
        'Content-Type': 'application/octet-stream',
        // 'X-SkipTxValidation': '1',
        'X-WaitForStatus': '7'
    }
    if (ARC_TOKEN) {
        headers['Authorization'] = `Bearer ${ARC_TOKEN}`
    }
    const resp = await fetch(`${ARC}/v1/tx`, {
        method: 'POST',
        headers,
        body: txbuf,
    })
    const respText = await resp.text();
    console.log("ARC Response:", resp.status, tx.id('hex'), respText, new Date().toISOString());
    const result = JSON.parse(respText)
    if (result.status != 200 || result.detail == 'REJECTED') {
        throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
    }
}
