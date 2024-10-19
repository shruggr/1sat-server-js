import { Controller, Get, Path, Query, Route } from "tsoa";
import { cache, getChainTip } from "../db";
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
        const hashes = await cache.zrangebyscore('blk:height', height, '+inf', 'LIMIT', 0, limit)
        const blocks = await cache.hmget('blk:headers', ...hashes)
        return blocks.filter(b => b).map((b) => JSON.parse(b!))
    }

    @Get("get/height/{height}")
    public async getBlock(
        @Path() height: number,
    ): Promise<BlockHeader> {
        const hashes = await cache.zrangebyscore('blk:height', height, height, 'LIMIT', 0, 1)
        const [block] = await cache.hmget('blk:headers', ...hashes)
        if (!block) {
            throw new NotFound()
        }
        return JSON.parse(block)
    }
}