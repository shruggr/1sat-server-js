import * as createError from "http-errors";
import { Redis } from "ioredis";
import { Body, BodyProp, Controller, Get, Path, Post, Route } from "tsoa";
import { Tx } from "@ts-bitcoin/core";

const { ARC, ARC_TOKEN, NETWORK, TAAL_TOKEN } = process.env;
const pubClient = new Redis();
export interface PreviousOutput {
    lockingScript: string,
    satoshis: number
}

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

        try {
            if (NETWORK == 'testnet') {
                try {
                    await this.broadcastWOC(txbuf);
                    this.broadcastArc(txbuf).catch(console.error)
                } catch (e: any) {
                    if (e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await this.broadcastArc(txbuf);
                }
            } else if (TAAL_TOKEN) {
                try {
                    await this.broadcastTaal(txbuf);
                    this.broadcastArc(txbuf).catch(console.error)
                } catch (e: any) {
                    if (e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await this.broadcastArc(txbuf);
                }
            } else {
                await this.broadcastArc(txbuf);
            }

            pubClient.publish('submit', txid);
            return txid;
        } catch (e: any) {
            console.error("Broadcast Error:", e)
            throw e;
        }

    }

    async broadcastWOC(txbuf: Buffer) {
        const net = NETWORK == 'testnet' ? 'test' : 'main'
        const resp = await fetch(`https://api.whatsonchain.com/v1/bsv/${net}/tx/raw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({txhex: txbuf.toString('hex')})
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

    async broadcastTaal(txbuf: Buffer) {
        const resp = await fetch('https://api.taal.com/api/v1/broadcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': TAAL_TOKEN!
            },
            body: txbuf
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

    async broadcastArc(txbuf: Buffer) {
        const headers: { [key: string]: string } = {
            'Content-Type': 'application/octet-stream',
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
        console.log("ARC Response:", resp.status, respText);
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

