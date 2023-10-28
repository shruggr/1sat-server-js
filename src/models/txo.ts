import { Address, OpCode, Script } from '@ts-bitcoin/core';
import { Outpoint } from "./outpoint";
import { loadTx, pool } from "../db";
import { File } from "./file";
import { Sigma } from "./sigma";

export class InscriptionData {
    type?: string = '';
    data?: Buffer = Buffer.alloc(0);
}

export interface Claim {
    sub: string;
    type: string;
    value: string;
}
export class Origin {
    outpoint: Outpoint = new Outpoint();
    data?: TxoData;
    num?: number;
    map?: {[key: string]:any};
    claims?: Claim[]
}

export enum Bsv20Status {
    Invalid = -1,
    Pending = 0,
    Valid = 1
}

export class TxoData {
    types?: string[];
    insc?: Inscription;
    map?: {[key: string]:any};
    b?: File;
    sigma?: Sigma[];
    list?: {
        price?: number;
        payout?: string;
    };
    bsv20?: {
        id?:  Outpoint;
        p?: string;
        op?: string;
        tick?: string;
        amt?: string;
        status?: Bsv20Status;
        implied?: boolean; 
    };
}

export interface Inscription {
    json?: any;
    text?: string;
    words?: string[];
    file?: File;
}
export class Txo {
    txid: string = '';
    vout: number = 0;
    outpoint: Outpoint = new Outpoint();
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
        const { rows: [row] } = await pool.query(`SELECT t.*, o.data as odata, n.num
            FROM txos t
            JOIN txos o ON o.outpoint = t.origin
            JOIN origins n ON n.origin = t.origin
            WHERE t.txid = $1 AND t.vout = $2`,
            [outpoint.txid, outpoint.vout],
        );

        return Txo.fromRow(row);
    }

    static async loadFileByOrigin(origin: Outpoint) {
        const tx = await loadTx(origin.txid.toString('hex'));
        return Txo.parseOutputScript(tx.txOuts[origin.vout].script);
    }

    static fromRow(row: any) {
        const txo = new Txo();
        txo.txid = row.txid.toString('hex');
        txo.vout = row.vout;
        txo.outpoint = new Outpoint(row.txid, row.vout);
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
            data: row.odata ? row.odata : undefined,
            num: row.num && parseInt(row.num, 10),
        }
        return txo;
    }

    static parseOutputScript(script: Script): InscriptionData {
        let opFalse = 0;
        let opIf = 0;
        let opORD = 0;
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
                    break;
                }
            }
        }

        let insData = new InscriptionData();
        for (let i = opORD + 1; i < script.chunks.length; i += 2) {
            if (script.chunks[i].buf) break;
            switch (script.chunks[i].opCodeNum) {
                case OpCode.OP_0:
                    insData.data = script.chunks[i + 1].buf;
                    return insData;
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