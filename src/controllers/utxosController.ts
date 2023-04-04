import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Tx } from '@ts-bitcoin/core';
import { Controller, Get, Path, Route } from "tsoa";
import { Inscription } from "../models/inscription";
import { Txo } from "../models/txo";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');
@Route("api/utxos")
export class UtxosController extends Controller {
    @Get("lock/{lock}")
    public async getByLock(@Path() lock: string): Promise<Txo[]> {
        return Txo.loadUtxosByLock(lock);
    }

    @Get("address/{address}")
    public async getByAddress(@Path() address: string): Promise<Txo[]> {
        return Txo.loadUtxosByAddress(address);
    }

    @Get("lock/{lock}/history")
    public async getHistoryByLock(@Path() lock: string): Promise<Txo[]> {
        return Txo.loadHistoryByLock(lock);
    }

    @Get("address/{address}/history")
    public async getHistoryByAddress(@Path() address: string): Promise<Txo[]> {
        return Txo.loadHistoryByAddress(address);
    }

    @Get("lock/{lock}/inscriptions")
    public async getInscriptionsByLock(@Path() lock: string): Promise<Inscription[]> {
        return Txo.loadInscriptionsByLock(lock);
    }

    @Get("address/{address}/inscriptions")
    public async getInscriptionsByAddress(@Path() address: string): Promise<Inscription[]> {
        return Txo.loadInscriptionsByAddress(address);
    }

    @Get("origin/{origin}")
    public async getTxoByOrigin(@Path() origin: string): Promise<Txo> {
        const ins = await Txo.loadOneByOrigin(origin);
        const txnData = await jb.GetTransaction(ins.txid);
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        ins.script = tx.txOuts[ins.vout].script.toHex();
        return ins
    }

}