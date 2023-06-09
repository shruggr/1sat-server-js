import { Request as ExpRequest } from "express";
import { Controller, Get, Path, Request, Route } from "tsoa";
import { Inscription } from "../models/inscription";
import { Outpoint } from "../models/outpoint";
import { NotFound } from 'http-errors';

@Route("api/ordfs")
export class StatsController extends Controller {
    @Get("{origin}/{filename}")
    public async getOrdfsFile(
        @Path() origin: string,
        @Path() filename: string,
        @Request() req: ExpRequest,
    ): 
    Promise<void> {
        const dirData = await Inscription.loadFileByOrigin(Outpoint.fromString(origin))
        const dir = JSON.parse(dirData.data!.toString('utf8'));
        if(!dir[filename]) {
            throw new NotFound()
        }
        const insData = await Inscription.loadFileByOrigin(Outpoint.fromString(dir[filename]))
        req.res!.header('Content-Type', insData.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(insData.data);

    }
}