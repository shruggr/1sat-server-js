import { NotFound } from 'http-errors';
import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";
import { loadTx, pool, redis } from "../db";
import { Outpoint } from '../models/outpoint';
import { Address } from '@ts-bitcoin/core';
import { Txo } from '../models/txo';
import { Transaction, Utils } from '@bsv/sdk';
import { TxController } from './txController';

const {JUNGLEBUS } = process.env;

export interface OpnsResponse {
    outpoint: Outpoint;
    origin: Outpoint;
    owner: string;
    domain: string;
    map?: { [key: string]: any };
}

export interface OpnsMine {
    outpoint: Outpoint
    origin: Outpoint
    domain: string
    pow: string
    script: string
}

export interface TxLog {
    txid: string
    height?: number
    idx?: number
}

@Route("api/opns")
export class OpnsController extends Controller {
    @Get("{domain}")
    public async getOpns(
        @Path() domain: string,
    ): Promise<OpnsResponse> {
        const opns = await OpnsController.lookupOpns(domain);
        if (!opns) {
            throw new NotFound();
        }
        return opns;
    }

    @Get("{domain}/mine")
    public async getOpnsMine(
        @Path() domain: string,
    ): Promise<OpnsMine> {
        let toMine = ''
        let mine = await OpnsController.lookupMine(domain);
        if (mine) return mine;
        while (!mine && domain.length > 0) {
            toMine = domain.slice(-1) + toMine;
            domain = domain.slice(0, -1);
            mine = await OpnsController.lookupMine(domain);
        }
        if (!mine) {
            throw new NotFound();
        }
        return mine;
    }

    @Get("{domain}/since/{blockHeight}")
    public async getWalletTxs(
        @Path() domain: string,
        @Path() blockHeight: number,
        @Query() limit = 100,
        @Query() offset = 0,
    ): Promise<TxLog[]> {
        const opns = await OpnsController.lookupOpns(domain)
        if (!opns) {
            throw new NotFound();
        }
        const key = `txlog:${opns.owner}`
        console.log("TXLOG", { key })
        const latest = await redis.zrevrangebyscore(key, 9999999, 0, 'WITHSCORES', 'LIMIT', 0, 1)
        let syncFrom = latest[1] ? parseInt(latest[1]) - 5 : 0
        console.log("TXLOG", { blockHeight })
        
        const url = `${JUNGLEBUS}/v1/address/get/${opns.owner}/${syncFrom}`
        console.log("TXLOG", { url })
        const resp = await fetch(url)
        const results = await resp.json() as {transaction_id: string, block_height: number, block_index: number}[]
        console.log("TXLOG", { length: results.length, results })

        const toUpdate = new Set<string>()
        for (const tx of results) {
            let scoreStr = await redis.zscore(key, tx.transaction_id)
            const height = scoreStr ? parseInt(scoreStr) : 0
            if (!height || height > 50000000) {
                toUpdate.add(tx.transaction_id)
            }
        }

        const { rows } = await pool.query(`
            SELECT txid, height, idx, created
            FROM txns
            WHERE txid = ANY($1)`,
            [Array.from(toUpdate).map(txid => Buffer.from(txid, 'hex'))]
        );
        const pipe = redis.pipeline()
        for (const { txid, height, idx, created } of rows) {
            let score = height ?
                `${height}.${idx.toString().padStart(8, '0')}` :
                created.getTime()
            const txidHex = txid.toString('hex')
            pipe.zadd(key, score, txidHex)
            toUpdate.delete(txidHex)
        }
        for (const txid of toUpdate) {
            pipe.zadd(key, Date.now(), txid)
        }
        await pipe.exec()
        
        const txns = await redis.zrangebyscore(key, blockHeight - 5, '+inf', 'WITHSCORES', 'LIMIT', offset, limit);
        const out: TxLog[] = []
        for (let i = 0; i < txns.length; i += 2) {
            const txid = txns[i]
            const score = txns[i + 1]
            const [heightStr, idxStr] = score.split('.')
            const log: TxLog = {txid}
            const height = parseInt(heightStr)
            if (height < 50000000) {
                log.height = height
                log.idx = parseInt(idxStr)
            }
            out.push(log)
        }
        return out
    }

    @Post("{domain}/tx")
    public async listBlocks(
        @Path() domain: string,
        @Body() txbuf: Buffer,
        @Query() tags: string[] = [],
        @Query() broadcast = false,
        @Query() format: 'tx' | 'ef' | 'beef' = 'beef',
    ): Promise<void> {
        const opns = await OpnsController.lookupOpns(domain)
        if (!opns) {
            throw new NotFound();
        }

        let tx = format == 'tx' ?
            Transaction.fromBinary([...txbuf]) :
            format == 'beef' ?
                Transaction.fromBEEF([...txbuf]) :
                Transaction.fromEF([...txbuf]);
        
        const txid = tx.id('hex') as string
        if (broadcast) {
            await TxController.doBroadcast(tx)
        }
        await redis.sadd(`txtag:${txid}:${opns.owner}`,  ...tags)
    }

    static async lookupOpns(domain: string): Promise<OpnsResponse | undefined> {
        const query = `SELECT t.outpoint, t.origin, t.pkhash, o.data->'opns'->>'domain' as domain, m.map
        FROM txos t
        JOIN txos o ON o.outpoint = t.origin
        LEFT JOIN origins m ON m.origin = t.origin
        WHERE t.spend = '\\x' AND o.data @> $1`;
        const { rows: [opns] } = await pool.query(
            query,
            [JSON.stringify({ opns: { domain, status: 1 } })]
        );
        return opns && {
            outpoint: Outpoint.fromBuffer(opns.outpoint),
            origin: Outpoint.fromBuffer(opns.origin),
            domain: opns.domain,
            owner: Address.fromPubKeyHashBuf(opns.pkhash).toString(),
            map: opns.map,
        };
    }

    static async lookupMine(domain: string): Promise<OpnsMine | undefined> {
        const query = `SELECT outpoint, origin, pkhash, data->>'opnsMine' as mine
            FROM txos t
            WHERE t.spend = '\\x' AND data @> $1`;
        const { rows: [mine] } = await pool.query(
            query,
            [JSON.stringify({ opnsMine: { domain, status: 1 } })]
        );
        if (!mine) return
        const opnsMine = JSON.parse(mine.mine)
        const outpoint = Outpoint.fromBuffer(mine.outpoint)
        const txo = await Txo.getByOutpoint(outpoint)
        const tx = await loadTx(txo.txid)
        return {
            outpoint,
            origin: Outpoint.fromBuffer(mine.origin),
            domain: opnsMine.domain,
            pow: opnsMine.pow,
            script: Utils.toBase64(tx.outputs[txo.vout].lockingScript.toBinary())
        }
    }
}