import {JungleBusClient} from "@gorillapool/js-junglebus";
import { Tx } from "@ts-bitcoin/core";
import { Request as ExpRequest } from "express";
import { NotFound } from 'http-errors';
// import { Readable } from 'stream';
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
        if (!req.res) throw new Error("No response object");
        req.res.header('Content-Type', insData.type || '');
        req.res.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res.status(200).send(insData.data);
    }
}