import { Controller, Get, Path, Query, Route } from "tsoa";
import { getChainTip, redis } from "../db";
import { NotFound } from 'http-errors';
import { BlockHeader } from "../models/block";

@Route("api/blocks")
export class BlocksController extends Controller {
    @Get("tip")
    public async getChaintip() {
        return getChainTip();
    }

    @Get("list/{height}")
    public async listBlocks(
        @Path() height: number,
        @Query() limit = 1000,
    ): Promise<BlockHeader[]> {
        const blocks = await redis.lrange('blocks', height, height + limit)
        return blocks.map((b) => JSON.parse(b))
    }

    @Get("get/height/{height}")
    public async getBlock(
        @Path() height: number,
    ): Promise<BlockHeader> {
        const block = await redis.lindex(`blocks`, height)
        if (!block) {
            throw new NotFound()
        }
        return JSON.parse(block)
    }
}