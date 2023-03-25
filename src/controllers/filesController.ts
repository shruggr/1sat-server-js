import {JungleBusClient} from "@gorillapool/js-junglebus";
import { Tx } from "@ts-bitcoin/core";
import { Request as ExpRequest } from "express";
import { NotFound } from 'http-errors';
import { Readable } from 'stream';
import { Controller, Get, Path, Request, Route } from "tsoa";
import { Inscription, Origin } from "../models";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');

@Route("api/files")
export class FilesController extends Controller {
    @Get("inscriptions/{origin}")
    public async getInscription(
        @Path() origin: string,
        @Request() req: ExpRequest,
    ): Promise<void> {
        const im = await Inscription.loadOneByOrigin(Origin.fromString(origin));
        const jbTxn = await jb.GetTransaction(im.txid);
        if(!jbTxn) throw new NotFound('not-found');
        const tx = Tx.fromBuffer(Buffer.from(jbTxn.transaction, 'base64'));
        const insData = Inscription.parseOutputScript(tx.txOuts[im.vout].script);

        if(!insData.data) throw new NotFound('not-found');
        if(insData.type) this.setHeader('content-type', insData.type || '');
        this.setStatus(200);
        this.setHeader('cache-control', 'public,immutable,max-age=31536000')
        
        if (!req.res) throw new Error("No response object");
        const res = req.res;
        return new Promise(async (resolve, reject) => 
            Readable.from(insData.data || Buffer.alloc(0))
                .on('error', reject)
                .on('end', function () {
                    resolve(undefined)
                })
                .pipe(res));
    }
}