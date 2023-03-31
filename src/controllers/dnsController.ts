
import * as dns from 'dns/promises'
import { Request as ExpRequest } from "express";
import { NotFound } from 'http-errors';
import { Controller, Get, Request, Route } from "tsoa";
import { Inscription, Outpoint } from "../models";

@Route("")
export class DnsController extends Controller {
    @Get("")
    public async getInscription(
        @Request() req: ExpRequest,
    ): Promise<void> {
        console.log("HOST:", req.hostname)
        const TXTs = await dns.resolveTxt(req.hostname);
        const prefix = "1sat-origin=";
        let origin = '';
        for(let TXT of TXTs) {
            for(let elem of TXT) {
                if(!elem.startsWith(prefix)) continue;
                console.log("Elem:", elem)
                origin = elem.slice(prefix.length)
                console.log("Origin:", origin)
            }
        }

        if(!origin) {
            throw new NotFound()
        }
        const insData = await Inscription.loadFileByOrigin(Outpoint.fromString(origin))
        if(!insData.data) throw new NotFound('not-found');
        if (!req.res) throw new Error("No response object");
        req.res.header('Content-Type', insData.type || '');
        req.res.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res.status(200).send(insData.data);
    }
}