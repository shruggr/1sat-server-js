import { JungleBusClient } from "@gorillapool/js-junglebus";
import { Address, OpCode, Script, Tx } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { Outpoint } from "./outpoint";
import { pool } from "../db";
import { File } from "./file";
import { Sigma } from "./sigma";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');
export class InscriptionData {
    type?: string = '';
    data?: Buffer = Buffer.alloc(0);
}

export class Origin {
    outpoint: Outpoint = new Outpoint();
    insc?: File;
    map?: {[key: string]:any};
    num?: number;
}

export enum Bsv20Status {
    Invalid = -1,
    Pending = 0,
    Valid = 1
}

export class TxoData {
    types?: string[];
    insc?: File;
    map?: {[key: string]:any};
    b?: File;
    sigma?: Sigma[];
    listing?: {
        price: number;
        payout: string;
    };
    bsv20?: {
        id?:  Outpoint;
        p: string;
        op: string;
        tick?: string;
        amt: string;
        status?: Bsv20Status 
    };
}

export interface Inscription {
    json?: any;
    text?: string;
    words?: string[];
    file: File;
}
export class Txo {
    txid: string = '';
    vout: number = 0;
    satoshis: number = 0;
    accSats: number = 0;
    owner?: string;
    script?: string;
    spend?: string;
    origin?: Origin;
    height: number = 0;
    idx: number = 0;
    data?: TxoData;

    static async loadByOutpoint(outpoint: Outpoint): Promise<Txo> {
        const { rows: [row] } = await pool.query(`SELECT t.*, o.insc, o.map, o.num
            FROM txos t
            JOIN origins o ON o.origin = t.origin
            WHERE t.txid = $1 AND t.vout = $2`,
            [outpoint.txid, outpoint.vout],
        );

        return Txo.fromRow(row);
    }

    static async loadFileByOrigin(origin: Outpoint) {
        const txo = await Txo.loadByOutpoint(origin);
        const jbTxn = await jb.GetTransaction(txo.txid);
        if (!jbTxn) throw new NotFound('not-found');
        const tx = Tx.fromBuffer(Buffer.from(jbTxn.transaction, 'base64'));
        return Txo.parseOutputScript(tx.txOuts[txo.vout].script);
    }

    static fromRow(row: any) {
        const txo = new Txo();
        txo.txid = row.txid.toString('hex');
        txo.vout = row.vout;
        txo.satoshis = parseInt(row.satoshis, 10);
        txo.accSats = row.outacc;
        txo.owner = row.pkhash && Address.fromPubKeyHashBuf(row.pkhash).toString();
        txo.spend = row.spend?.toString('hex');
        txo.origin = row.origin && Outpoint.fromBuffer(row.origin);
        txo.height = row.height;
        txo.idx = row.idx;
        txo.data = row.data;
        txo.origin = {
            outpoint: Outpoint.fromBuffer(row.origin),
            insc: row.insc ? row.insc : undefined,
            map: row.map ? row.map : undefined,
            num: row.num ? parseInt(row.num, 10) : undefined,
        }
        return txo;
    }

    static parseOutputScript(script: Script): InscriptionData {
        let opFalse = 0;
        let opIf = 0;
        let opORD = 0;
        const lock = new Script();
        for (let [i, chunk] of script.chunks.entries()) {
            if (chunk.opCodeNum === OpCode.OP_FALSE) {
                opFalse = i;
            }
            if (chunk.opCodeNum === OpCode.OP_IF) {
                opIf = i;
            }
            if (chunk.buf?.equals(Buffer.from('ord', 'utf8'))) {
                if (opFalse === i - 2 && opIf === i - 1) {
                    opORD = i;
                    lock.chunks = script.chunks.slice(0, i - 2);
                    break;
                }
            }
            lock.chunks.push(chunk);
        }

        let insData = new InscriptionData();
        for (let i = opORD + 1; i < script.chunks.length; i += 2) {
            if (script.chunks[i].buf) break;
            switch (script.chunks[i].opCodeNum) {
                case OpCode.OP_0:
                    insData.data = script.chunks[i + 1].buf;
                    break;
                case OpCode.OP_1:
                    insData.type = script.chunks[i + 1].buf?.toString('utf8');
                    break;
                case OpCode.OP_ENDIF:
                    break;
            }
        }
        return insData;
    }
}