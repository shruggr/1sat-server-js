import { Request as ExpRequest } from "express";
import { NotFound } from 'http-errors';
import { Controller, Get, Path, Request, Route } from "tsoa";
import { Inscription, Outpoint } from "../models";


@Route("api/files")
export class FilesController extends Controller {
    @Get("inscriptions/{origin}")
    public async getInscription(
        @Path() origin: string,
        @Request() req: ExpRequest,
    ): Promise<void> {
        const insData = await Inscription.loadFileByOrigin(Outpoint.fromString(origin))
        if(!insData.data) throw new NotFound('not-found');
        if (!req.res) throw new Error("No response object");
        req.res.header('Content-Type', insData.type || '');
        req.res.header('Cache-Control', 'public,immutable,max-age=31536000')
        req.res.status(200).send(insData.data);
    }
}