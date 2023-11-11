import { Request as ExpRequest } from "express";
import { NotFound } from "http-errors";
import { Controller, Get, Path, Query, Request, Route } from "tsoa";
import { Outpoint } from "../models/outpoint";
import { InscriptionData, Txo } from "../models/txo";
// import { NotFound } from 'http-errors';

@Route("content")
export class ContentController extends Controller {
    @Get("{outpoint}")
    public async getOrdfsFile(
        @Path() outpoint: string,
        @Request() req: ExpRequest,
        @Query() fuzzy: boolean = false
    ): 
    Promise<void> {
        let file: InscriptionData | undefined;
        if(outpoint.length == 64) {
            file = await Txo.loadFileByTxid(outpoint);
        } else {
            const op = Outpoint.fromString(outpoint);
            file = await Txo.loadFileByOutpoint(op);
            if(!file && fuzzy) {
                const txo = await Txo.loadByOutpoint(op);
                if(txo.origin?.outpoint) {
                    file = await Txo.loadFileByOutpoint(txo.origin?.outpoint);
                }
            }
        }
        if(!file) {
            throw new NotFound();
        }
        req.res!.header('Content-Type', file.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(file.data);
    }
}