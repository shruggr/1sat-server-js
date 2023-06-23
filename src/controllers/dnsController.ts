
import {JungleBusClient} from "@gorillapool/js-junglebus";
import * as dns from 'dns/promises'
import * as fs from 'fs/promises';
import { Request as ExpRequest } from "express";
import { NotFound } from 'http-errors';
import { Controller, Get, Path, Request, Route } from "tsoa";
import { Inscription, InscriptionData } from "../models/inscription";
import { Outpoint } from "../models/outpoint";
import { Tx } from "@ts-bitcoin/core";
import Redis from "ioredis";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');
const redis = new Redis();

@Route("")
export class DnsController extends Controller {
    @Get("")
    public async getDnsInscription(
        @Request() req: ExpRequest,
    ): Promise<void> {
        console.log("HOST:", req.hostname)
        const outpoint = await this.loadDnsOrigin(req.hostname)
        
        let insData = await this.loadInscription(outpoint)
        if(!insData.data) throw new NotFound('not-found');
        if(insData.type === 'ord-fs/json') {
            req.res?.redirect('index.html');
            return
        }
        req.res!.header('Content-Type', insData.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(insData.data);
    }

    @Get("{filename}")
    public async getOrdfs(
        @Path() filename: string,
        @Request() req: ExpRequest,
    ): 
    Promise<void> {
        let outpoint: Outpoint;
        let insData: InscriptionData
        try {
            console.log('filename', filename)
            outpoint = Outpoint.fromString(filename)
            insData = await this.loadInscription(outpoint)
            if(!insData.data) {
                console.log('NOT FOUND', outpoint.toString())
                throw new NotFound('not-found');
            }
            if(insData.type === 'ord-fs/json') {
                req.res?.redirect(`${outpoint.toString()}/index.html`);
                return
            }
        } catch (e: any) {
            console.error('Outpoint Error', filename, e);
            outpoint = await this.loadDnsOrigin(req.hostname);
            const dirData = await this.loadInscription(outpoint);
            const dir = JSON.parse(dirData.data!.toString('utf8'));
            if(!dir[filename]) {
                throw new NotFound()
            }
            outpoint = Outpoint.fromString((dir[filename] as string).slice(6))
            insData = await this.loadInscription(outpoint)
        }
        req.res!.header('Content-Type', insData.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(insData.data);
    }

    @Get("content/{id}")
    public async getByContent(
        @Path() id,
        @Request() req: ExpRequest,
    ): Promise<void> {
        
    }

    @Get("{origin}/{filename}")
    public async getOrdfsFile(
        @Path() origin: string,
        @Path() filename: string,
        @Request() req: ExpRequest,
    ): 
    Promise<void> {
        const dirData = await this.loadInscription(Outpoint.fromString(origin))
        const dir = JSON.parse(dirData.data!.toString('utf8'));
        if(!dir[filename]) {
            throw new NotFound()
        }
        const file = (dir[filename] as string).slice(6)
        const insData = await this.loadInscription(Outpoint.fromString(file))
        req.res!.header('Content-Type', insData.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(insData.data);
    }

    async loadDnsOrigin(hostname: string): Promise<Outpoint> {
        const TXTs = await dns.resolveTxt(hostname);
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
        return Outpoint.fromString(origin)
    }

    async loadInscription(outpoint: Outpoint): Promise<InscriptionData> {
        const txnData = await jb.GetTransaction(outpoint.txid.toString('hex'));
        const tx = Tx.fromBuffer(Buffer.from(txnData?.transaction || '', 'base64'));
        return Inscription.parseOutputScript(tx.txOuts[outpoint.vout].script);
    }
}