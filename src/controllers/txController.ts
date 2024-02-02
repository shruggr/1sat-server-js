import * as createError from "http-errors";
import { Redis } from "ioredis";
import { Body, BodyProp, Controller, Get, Path, Post, Route } from "tsoa";
import { Tx } from "@ts-bitcoin/core";
import { loadTxo } from "../db";
import { Outpoint } from "../models/outpoint";

const {StandardToExtended} = require('bitcoin-ef')

let { ARC, ARC_TOKEN, NETWORK, TAAL_TOKEN, REDIS } = process.env;

const rparts = (REDIS || '').split(':')
const pubClient = new Redis({
    port: rparts[1] ? parseInt(rparts[1]) : 6379,
    host: rparts[0],
});

export interface PreviousOutput {
    lockingScript: string,
    satoshis: number
}

// ARC_TOKEN='mainnet_3c4ab60e633fa8524272900e5603ca7c'
// ARC='https://arc.taal.com'

@Route("api/tx")
export class TxController extends Controller {
    @Post("bin")
    public async broadcastBuf(
        @Body() txbuf: Buffer
    ) {
        return this.doBroadcast(txbuf);
    }

    @Post()
    public async broadcast(
        @BodyProp() rawtx: string,
    ): Promise<string> {
        const txbuf = Buffer.from(rawtx, 'base64')

        return this.doBroadcast(txbuf);
    }

    async doBroadcast(txbuf: Buffer): Promise<string> {
        const tx = Tx.fromBuffer(txbuf);
        let txid = tx.id();
        console.log('Broadcasting TX:', txid, tx.toHex());
        await pubClient.set(txid, txbuf)
        try {
            if (NETWORK == 'testnet') {
                try {
                    await this.broadcastWOC(tx);
                    this.broadcastArc(tx).catch(console.error)
                } catch (e: any) {
                    if (e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await this.broadcastArc(tx);
                }
            } else if (TAAL_TOKEN) {
                try {
                    await this.broadcastTaal(tx);
                    this.broadcastArc(tx).catch(console.error)
                } catch (e: any) {
                    if (e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await this.broadcastArc(tx);
                }
            } else {
                await this.broadcastArc(tx);
            }

            // await pubClient.set(txid, txbuf)
            pubClient.publish('broadcast', tx.toBuffer().toString('base64'));
            return txid;
        } catch (e: any) {
            console.error("Broadcast Error:", e)
            throw e;
        }
    }

    async broadcastWOC(tx: Tx) {
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

    async broadcastTaal(tx: Tx) {
        const resp = await fetch('https://api.taal.com/api/v1/broadcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': TAAL_TOKEN!
            },
            body: tx.toBuffer()
        });

        const respText = await resp.text();
        console.log("TAAL Response:", resp.status, respText);
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

    async broadcastArc(tx: Tx) {
        let txbuf: Buffer
        try {
            const parents = await Promise.all(tx.txIns.map(async txIn => {
                const inTxid = Buffer.from(txIn.txHashBuf).reverse()
                const op = new Outpoint(inTxid, txIn.txOutNum)
                return loadTxo(op)
            }))
            txbuf = StandardToExtended(tx.toBuffer(), parents) as Buffer
            // console.error("ARC EXT:", txbuf.toString('hex'), parents)
        } catch (e) {
            console.error("Error loading txos", tx.id)
            txbuf = tx.toBuffer();
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
        console.log("ARC Response:", resp.status, tx.id(), respText);
        const result = JSON.parse(respText)
        if (result.status != 200 || result.detail == 'REJECTED') {
            throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
        }
    }

    @Get("{txid}/submit")
    public async getTxSubmit(
        @Path() txid: string,
    ): Promise<void> {
        pubClient.publish('submit', txid);
    }

    @Post("{txid}/submit")
    public async postTxSubmit(
        @Path() txid: string,
    ): Promise<void> {
        pubClient.publish('submit', txid);
    }
}

