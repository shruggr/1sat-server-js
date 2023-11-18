import { Request as ExpRequest } from "express";
import { NotFound } from "http-errors";
import { Controller, Get, Path, Query, Request, Route } from "tsoa";
import { Outpoint } from "../models/outpoint";
import { InscriptionData, Txo } from "../models/txo";
import { pool } from "../db";

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
                const txo = await Txo.getByOutpoint(op);
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

    @Get("{outpoint}/latest")
    public async getLatestFile(
        @Path() outpoint: string,
        @Request() req: ExpRequest
    ): 
    Promise<void> {
        const { rows: [lastest] } = await pool.query(`
            SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin 
            WHERE t.origin = $1 AND t.data ? 'insc'
            ORDER BY t.height DESC, t.idx DESC
            LIMIT 1`,
            [Outpoint.fromString(origin).toBuffer()]
        );

        const txo = Txo.fromRow(lastest);
        let file = await Txo.loadFileByOutpoint(txo.outpoint);
        
        if(!file) {
            throw new NotFound();
        }
        req.res!.header('Content-Type', file.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(file.data);
    }
}