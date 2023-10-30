import * as createError from "http-errors";
import { Redis } from "ioredis";
import { Body, BodyProp, Controller, Path, Post, Route } from "tsoa";
import { Tx } from "@ts-bitcoin/core";

const { ARC, ARC_TOKEN, TAAL_TOKEN } = process.env;
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
            if(TAAL_TOKEN) {
                try {
                    await this.broadcastTaal(txbuf);
                    this.broadcastArc(txbuf).catch(console.error)
                } catch(e: any) {
                    if(e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await this.broadcastArc(txbuf);
                }
            } else {
                await this.broadcastArc(txbuf);
            }
           
            pubClient.publish('submit', txid);
            return txid;
        } catch(e: any) {
            console.error("Broadcast ERROR:", e)
            throw e;
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
                throw createError(status || resp.status || 500, `Broadcast failed: ${error}`);
            } catch(e: any) {
                console.error(e);
                throw e;
            }
        }
    }

    async broadcastArc(txbuf: Buffer) {
        const headers: {[key:string]:string} = {
            'Content-Type': 'application/octet-stream',
            'X-WaitForStatus': '7'
        }
        if(ARC_TOKEN) {
            headers['Authorization'] = `Bearer ${ARC_TOKEN}`
        }
        const resp = await fetch(`${ARC}/v1/tx`, {
            method: 'POST',
            headers,
            body: txbuf,
        })
        const respText = await resp.text();
        console.log("ARC Response:", resp.status, respText);
        try {
            const result = JSON.parse(respText)
            if (result.status != 200) {
                throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
            }
        } catch {
            throw createError(500, `Broadcast failed: parsing error`);
        }
    }

    @Post("{txid}/submit")
    public async getTx(
        @Path() txid: string,
    ): Promise<void> {
        pubClient.publish('submit', txid);
    }
}

