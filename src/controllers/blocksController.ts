import { Controller, Get, Path, Query, Route } from "tsoa";
import { BlockHeader } from "../models/block";

@Route("api/blocks")
export class BlocksController extends Controller {
    @Get("tip")
    public async getChaintip(): Promise<BlockHeader> {
        const resp = await fetch("https://junglebus.gorillapool.io/v1/block_header/tip")
        return resp.json()
    }

    @Get("list/{id}")
    public async listBlocks(
        @Path() id: string,
        @Query() limit = '100',
    ): Promise<BlockHeader[]> {
        const url = `https://junglebus.gorillapool.io/v1/block_header/list/${id}?limit=${limit}`
        console.log({url})
        const resp = await fetch(url)
        const data = await resp.json()
        if(!data) return []
        return data
    }

    @Get("get/{id}")
    public async getBlock(
        @Path() id: string,
    ): Promise<BlockHeader> {
        const resp = await fetch(`https://junglebus.gorillapool.io/v1/block_header/get/${id}`)
        return resp.json()
    }
}