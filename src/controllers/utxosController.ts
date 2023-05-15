import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Query, Route } from "tsoa";
import { Inscription } from "../models/inscription";
import { Txo } from "../models/txo";
import { SortDirection } from "../models/listing";

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
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadInscriptionsByLock(lock, limit, offset, dir);
    }

    @Get("address/{address}/inscriptions")
    public async getInscriptionsByAddress(
        @Path() address: string,
        @Query() limit: number = 100,
        @Query() offset: number = 0,
        @Query() dir: SortDirection = SortDirection.desc,
    ): Promise<Inscription[]> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        return Txo.loadInscriptionsByAddress(address, limit, offset, dir);
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