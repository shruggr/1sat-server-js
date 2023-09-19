import { Request as ExpRequest } from "express";
import { Controller, Get, Path, Request, Route } from "tsoa";
import { Outpoint } from "../models/outpoint";
import { Txo } from "../models/txo";
// import { NotFound } from 'http-errors';

@Route("content")
export class ContentController extends Controller {
    @Get("{outpoint}")
    public async getOrdfsFile(
        @Path() outpoint: string,
        @Request() req: ExpRequest,
    ): 
    Promise<void> {
        const file = await Txo.loadFileByOrigin(Outpoint.fromString(outpoint))
        req.res!.header('Content-Type', file.type || '');
        req.res!.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res!.status(200).send(file.data);
    }
}