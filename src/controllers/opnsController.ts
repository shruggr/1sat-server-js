import { NotFound } from 'http-errors';
import { Controller, Get, Path, Route } from "tsoa";
import { loadTx, pool } from "../db";
import { Outpoint } from '../models/outpoint';
import { Address } from '@ts-bitcoin/core';
import { Txo } from '../models/txo';

export interface OpnsResponse {
    outpoint: Outpoint;
    origin: Outpoint;
    owner: string;
    domain: string;
    map?: { [key: string]: any };
}

export interface OpnsMine {
    outpoint: Outpoint
    origin: Outpoint
    domain: string
    pow: string
    script: string
}

@Route("api/opns")
export class OpnsController extends Controller {
    @Get("{domain}")
    public async getOpns(
        @Path() domain: string,
    ): Promise<OpnsResponse> {
        const opns = await this.lookupOpns(domain);
        if (!opns) {
            throw new NotFound();
        }
        return opns;
    }

    @Get("{domain}/mine")
    public async getOpnsMine(
        @Path() domain: string,
    ): Promise<OpnsMine> {
        let toMine = ''
        let mine = await this.lookupMine(domain);
        if (mine) return mine;
        while (!mine && domain.length > 0) {
            toMine = domain.slice(-1) + toMine;
            domain = domain.slice(0, -1);
            mine = await this.lookupMine(domain);
        }
        if (!mine) {
            throw new NotFound();
        }
        return mine;
    }

    async lookupOpns(domain: string): Promise<OpnsResponse | undefined> {
        const query = `SELECT t.outpoint, t.origin, t.pkhash, o.data->'opns'->>'domain' as domain, m.map
        FROM txos t
        JOIN txos o ON o.outpoint = t.origin
        LEFT JOIN origins m ON m.origin = t.origin
        WHERE t.spend = '\\x' AND o.data @> $1`;
        const { rows: [opns] } = await pool.query(
            query,
            [JSON.stringify({ opns: { domain, status: 1 } })]
        );
        return opns && {
            outpoint: Outpoint.fromBuffer(opns.outpoint),
            origin: Outpoint.fromBuffer(opns.origin),
            domain: opns.domain,
            owner: Address.fromPubKeyHashBuf(opns.pkhash).toString(),
            map: opns.map,
        };
    }

    async lookupMine(domain: string): Promise<OpnsMine | undefined> {
        const query = `SELECT outpoint, origin, pkhash, data->>'opnsMine' as mine
            FROM txos t
            WHERE t.spend = '\\x' AND data @> $1`;
        const { rows: [mine] } = await pool.query(
            query,
            [JSON.stringify({ opnsMine: { domain, status: 1 } })]
        );
        if (!mine) return
        const opnsMine = JSON.parse(mine.mine)
        const outpoint = Outpoint.fromBuffer(mine.outpoint)
        const txo = await Txo.getByOutpoint(outpoint)
        const tx = await loadTx(txo.txid)
        return {
            outpoint,
            origin: Outpoint.fromBuffer(mine.origin),
            domain: opnsMine.domain,
            pow: opnsMine.pow,
            script: tx.txOuts[txo.vout].script.toBuffer().toString('base64')
        }
    }
}