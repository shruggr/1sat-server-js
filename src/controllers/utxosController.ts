import { Controller, Get, Path, Route } from "tsoa";
import { Inscription, Txo } from "../models";

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

    @Get("lock/{lock}/inscriptions")
    public async getInscriptionsByLock(@Path() lock: string): Promise<Inscription[]> {
        return Txo.loadInscriptionsByLock(lock);
    }

    @Get("address/{address}/inscriptions")
    public async getInscriptionsByAddress(@Path() address: string): Promise<Inscription[]> {
        return Txo.loadInscriptionsByAddress(address);
    }

}