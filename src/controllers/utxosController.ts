import { Controller, Get, Path, Route } from "tsoa";
import { Txo } from "../models";

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
}