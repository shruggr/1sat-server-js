import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Address, Hash, Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { Inscription } from "../models/inscription";
import { Txo } from "../models/txo";
import { SortDirection } from "../models/listing";
import { Bsv20 } from "../models/bsv20";
import { pool } from "../db";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');
@Route("api/utxos")
export class UtxosController extends Controller {
    @Get("lock/{lock}")
    public async getByLock(@Path() lock: string): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadUtxosByLock(lock);
    }

    @Get("address/{address}")
    public async getByAddress(@Path() address: string): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadUtxosByAddress(address);
    }

    @Get("lock/{lock}/history")
    public async getHistoryByLock(@Path() lock: string): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadHistoryByLock(lock);
    }

    @Get("address/{address}/history")
    public async getHistoryByAddress(@Path() address: string): Promise<Txo[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadHistoryByAddress(address);
    }

    @Get("lock/{lock}/inscriptions")
    public async getInscriptionsByLock(
        @Path() lock: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() excludeBsv20: boolean = false,
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadInscriptionsByLock(lock, limit, offset, dir, excludeBsv20);
    }

    @Get("address/{address}/inscriptions")
    public async getInscriptionsByAddress(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.desc,
        @Query() excludeBsv20: boolean = false,
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadInscriptionsByAddress(address, limit, offset, dir, excludeBsv20);
    }

    @Get("address/{address}/tick/{tick}")
    public async getBsv20sByAddress(
        @Path() address: string,
        @Path() tick: string = '',
        @Query() fromHeight: number = 0,
        @Query() fromIdx: number = 0,
        @Query() limit: number = 100,
    ): Promise<Bsv20[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        ).reverse().toString('hex');
        return this.getBsv20sByLock(lock, tick, fromHeight, fromIdx, limit);
    }

    @Get("lock/{lock}/tick/{tick}")
    public async getBsv20sByLock(
        @Path() lock: string,
        @Path() tick: string = '',
        @Query() fromHeight: number = 0,
        @Query() fromIdx: number = 0,
        @Query() limit: number = 100,
    ): Promise<Bsv20[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`SELECT * 
            FROM bsv20_txos
            WHERE lock = $1 AND spend=decode('', 'hex')
                AND tick=$2 AND valid=TRUE
                AND (height > $3 OR (height = $3 AND idx >= $4))
            ORDER BY height, idx
            LIMIT $5`,
            [
                Buffer.from(lock, 'base64').toString('hex'),
                tick,
                fromHeight,
                fromIdx,
                limit,
            ]
        );
        return rows.map((row: any) => Bsv20.fromRow(row));
    }

    @Get("origin/{origin}")
    public async getTxoByOrigin(@Path() origin: string): Promise<Txo> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const ins = await Txo.loadOneByOrigin(origin);
        const txnData = await jb.GetTransaction(ins.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        ins.script = tx.txOuts[ins.vout].script.toBuffer().toString('base64');
        return ins
    }

}