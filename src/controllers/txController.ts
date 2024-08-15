import * as createError from "http-errors";
import { Redis } from "ioredis";
import { Request as ExpRequest } from "express";
import { Body, BodyProp, Controller, Get, Path, Post, Request, Route } from "tsoa";
import { loadProof, loadRawtx, loadTx, pool } from "../db";
import { MerklePath, Transaction, Utils } from "@bsv/sdk";

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
        const tx = Transaction.fromBinary([...txbuf]);
        return TxController.doBroadcast(tx);
    }

    @Post()
    public async broadcast(
        @BodyProp() rawtx: string,
    ): Promise<string> {
        const tx = Transaction.fromBinary(Utils.toArray(rawtx, 'base64'));
        return TxController.doBroadcast(tx);
    }

    static async doBroadcast(tx: Transaction): Promise<string> {
        let txid = tx.id('hex') as string;
        console.time('Broadcast: ' + txid)
        // console.timeLog('Broadcast: ' + txid, txbuf.toString('hex'))
        const txbuf = Buffer.from(tx.toBinary())
        await pubClient.set(txid, txbuf)
        try {
            if (NETWORK == 'testnet') {
                try {
                    await TxController.broadcastWOC(tx);
                    TxController.broadcastArc(tx).catch(console.error)
                } catch (e: any) {
                    if (e.status && e.status >= 300 && e.status < 500) {
                        throw e;
                    }
                    await TxController.broadcastArc(tx);
                }
            } else if (TAAL_TOKEN) {
                // try {
                    console.timeLog('Broadcast: ' + txid, "Broadcasting to TAAL")
                    await TxController.broadcastTaal(tx);
                    console.timeLog('Broadcast: ' + txid, "Broadcasting to ARC")
                    TxController.broadcastArc(tx).catch(console.error)
                // } catch (e: any) {
                //     if (!e.status || (e.status >= 300 && e.status < 500)) {
                //         throw e;
                //     }
                //     await this.broadcastArc(tx);
                // }
            } else {
                await TxController.broadcastArc(tx);
            }

            // await pubClient.set(txid, txbuf)
            console.timeLog('Broadcast: ' + txid, "Publishing to redis")
            await pubClient.hset('tx', txid, txbuf)
            pubClient.publish('broadcast', Utils.toBase64(tx.toBinary()));
            return txid;
        } catch (e: any) {
            console.error("Broadcast Error:", e)
            throw e;
        } finally {
            console.timeEnd('Broadcast: ' + txid)
        }
    }

    static async broadcastWOC(tx: Transaction) {
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

    static async broadcastTaal(tx: Transaction) {
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

    static async broadcastArc(tx: Transaction) {
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


    @Get("{txid}/status")
    public async getTxStatus(
        @Path() txid: string,
    ): Promise<{height: number, idx: number, hash: string} | undefined> {
        const {rows: [row]} = await pool.query(`SELECT height, block_id, idx 
            FROM txns WHERE txid=$1`, 
            [Buffer.from(txid, 'hex')]
        );
        if (!row) {
            throw new createError.NotFound();
        } else if (!row.height) {
            this.setStatus(204);
            return;
        } else {
            return {
                height: row.height,
                idx: row.idx,
                hash: row.block_id.toString('hex')
            }
        }
    }

    @Get("{txid}/rawtx")
    public async getTxRawtx(
        @Path() txid: string,
        @Request() req: ExpRequest
    ): Promise<void> {
        const rawtx = await loadRawtx(txid);
        if (!rawtx) {
            throw new createError.NotFound();
        }
        req.res!.type('application/octet-stream').status(200).send(rawtx);
    }

    @Get("{txid}/proof")
    public async getTxProof(
        @Path() txid: string,
        @Request() req: ExpRequest
    ): Promise<void> {
        const proof = await loadProof(txid);
        if (!proof) {
            throw new createError.NotFound();
        }
        req.res!.type('application/octet-stream').status(200).send(proof);
    }

    @Get("{txid}")
    public async getTx(
        @Path() txid: string,
        @Request() req: ExpRequest
    ): Promise<void> {
        const [rawtx, proof] = await Promise.all([
            loadRawtx(txid),
            await loadProof(txid).catch(() => undefined)
        ])
        const tx = Transaction.fromBinary([...rawtx]);
        if (proof) {
            tx.merklePath = MerklePath.fromBinary([...proof]);
        }
        req.res!.type('application/octet-stream').status(200).send(Buffer.from(tx.toBEEF()));
    }

    @Post("batch")
    public async getTxBatch(
        @Body() txids: string[],
        @Request() req: ExpRequest
    ): Promise<void> {
        const writer = new Utils.Writer()
        for await (const txid of txids) {
            const [rawtx, proof] = await Promise.all([
                loadRawtx(txid),
                await loadProof(txid).catch(() => undefined)
            ])
            const tx = Transaction.fromBinary([...rawtx]);
            if (proof) {
                tx.merklePath = MerklePath.fromBinary([...proof]);
            }
            const beef = tx.toBEEF();
            writer.writeVarIntNum(beef.length)
            writer.write(beef)
        }
        req.res!.type('application/octet-stream').status(200).send(Buffer.from(writer.toArray()));
    }
}

