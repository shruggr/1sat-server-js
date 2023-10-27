import * as createError from "http-errors";
import { Redis } from "ioredis";
import { BodyProp, Controller, Path, Post, Route } from "tsoa";
import { Tx } from "@ts-bitcoin/core";

const { ARC, ARC_TOKEN } = process.env;
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
        const txid = tx.id();
        console.log('Broadcasting TX:', txid, tx.toHex())
        try {
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
            console.error("Broadcast:", respText);
            const result = JSON.parse(respText);

            if (result.status != 200) {
                throw createError(result.status || 500, `Broadcast failed: ${result.detail} ${result.extraInfo}`);
            }
            pubClient.publish('submit', txid);
            return result.txid;
        } catch (e) {
            console.error("Broadcast Error:", e);
            throw e;
        }
    }

    @Post("{txid}/submit")
    public async getTx(
        @Path() txid: string,
    ): Promise<void> {
        pubClient.publish('submit', txid);
    }
}

