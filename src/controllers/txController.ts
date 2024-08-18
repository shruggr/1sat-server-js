import * as createError from "http-errors";
import { Request as ExpRequest } from "express";
import { Body, BodyProp, Controller, Get, Header, Path, Post, Query, Request, Route } from "tsoa";
import { loadProof, loadRawtx, pool, redis } from "../db";
import { MerklePath, Transaction, Utils } from "@bsv/sdk";
import { loadTxLogs, parseRawTx, refreshTxLogs, saveTxLog, TxLog } from "../models/tx";
import { broadcastTx } from "../models/broadcast";


// const SIG_EXPIRY = 1000 * 60 * 300;

@Route("api/tx")
export class TxController extends Controller {
    @Post("bin")
    public async broadcastBuf(
        @Body() txbuf: Buffer,
        @Query() format: 'tx' | 'ef' | 'beef' = 'tx',
    ) {
        const tx = parseRawTx([...txbuf], format);
        return broadcastTx(tx);
    }

    @Post()
    public async broadcast(
        @BodyProp() rawtx: string,
        @Query() format: 'tx' | 'ef' | 'beef' = 'tx',
    ): Promise<string> {
        const txbuf = Utils.toArray(rawtx, 'base64')
        const tx = parseRawTx(txbuf, format);
        return broadcastTx(tx);
    }

    @Get("{txid}/submit")
    public async getTxSubmit(
        @Path() txid: string,
    ): Promise<void> {
        redis.publish('submit', txid);
    }

    @Post("{txid}/submit")
    public async postTxSubmit(
        @Path() txid: string,
    ): Promise<void> {
        redis.publish('submit', txid);
    }


    @Get("{txid}/status")
    public async getTxStatus(
        @Path() txid: string,
    ): Promise<{ height: number, idx: number, hash: string } | undefined> {
        const { rows: [row] } = await pool.query(`SELECT height, block_id, idx 
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

    @Get("batch")
    public async getTxBatch(
        @Query() txids: string[],
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

    @Post("batch")
    public async postTxBatch(
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

    @Get("address/{address}/from/{blockHeight}")
    public async getAddressTxids(
        @Path() address: string,
        @Path() blockHeight: number,
        @Header('Authorization') auth?: string,
        @Query() limit = 100,
        @Query() offset = 0,
    ): Promise<TxLog[]> {
        await refreshTxLogs(address);

        return loadTxLogs(address, blockHeight, offset, limit);
    }


    @Post("address/{address}/{txid}")
    public async SaveTxPost(
        @Path() address: string,
        @Path() txid: string,
        @Body() txbuf?: Buffer,
        @Query() format: 'tx' | 'ef' | 'beef' = 'tx',
        @Query() tags: string[] = [],
        @Query() broadcast = false,
    ): Promise<void> {
        if(!txid && (!txbuf || txbuf.length === 0)) {
            throw new Error('txid or txbuf required')
        }

        if (txbuf && txbuf.length > 0) {
            const tx = parseRawTx([...txbuf], format);
            const newTxid = tx.id('hex') as string
            if (txid && txid !== newTxid) {
                throw new Error('txid mismatch')
            } else {
                txid = newTxid
            }
            if (broadcast) {
                await broadcastTx(tx)
            }
        }

        await saveTxLog(address, txid!, tags)
    }
}

