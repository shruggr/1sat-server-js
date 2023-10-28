import * as createError from "http-errors";
import { Redis } from "ioredis";
import { BodyProp, Controller, Path, Post, Route } from "tsoa";
import { Tx } from "@ts-bitcoin/core";

const { ARC, ARC_TOKEN, TAAL_TOKEN } = process.env;
const pubClient = new Redis();
export interface PreviousOutput {
    lockingScript: string,
    satoshis: number
}

@Route("api/tx")
export class TxController extends Controller {
    // @Post("bin")
    // public async broadcastBuf(
    //     @Body() txbuf: Buffer
    // ) {
    //     return this.doBroadcast(txbuf);
    // }

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
            const useTaal = TAAL_TOKEN
            if(useTaal) {
                try {
                    await this.broadcastTaal(txbuf);
                    this.broadcastArc(txbuf).catch(console.error)
                } catch {
                    await this.broadcastArc(txbuf).catch(console.error)
                }
            } else {
                await this.broadcastArc(txbuf)
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

        if (!resp.ok) {
            const respText = await resp.text();
            console.log("TAAL Response:", respText);
            try {
                const { resultDescription } = JSON.parse(respText);
                throw createError(resp.status || 500, `Broadcast failed: ${resultDescription}`);
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
        console.log("ARC Response:", respText);
        const result = JSON.parse(respText)

        if (result.status != 200) {
            throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
        }
    }

    @Post("{txid}/submit")
    public async getTx(
        @Path() txid: string,
    ): Promise<void> {
        pubClient.publish('submit', txid);
    }
}

