import { Address, OpCode, Script} from '@ts-bitcoin/core';
import { Outpoint } from "./outpoint";
import { loadTx, pool } from "../db";
import { File } from "./file";
import { Sigma } from "./sigma";
import { NotFound } from 'http-errors';

const B = Buffer.from('19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', 'utf8')
const ORD = Buffer.from('ord', 'utf8')
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
    map?: { [key: string]: any };
    // claims?: Claim[]
}

export enum Bsv20Status {
    Invalid = -1,
    Pending = 0,
    Valid = 1
}

export class TxoData {
    types?: string[];
    insc?: Inscription;
    map?: { [key: string]: any };
    b?: File;
    sigma?: Sigma[];
    list?: {
        price?: number;
        payout?: string;
    };
    bsv20?: {
        id?: Outpoint;
        p?: string;
        op?: string;
        tick?: string;
        sym?: string;
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
            WHERE t.outpoint = $1`,
            [outpoint.toBuffer()],
        );

        if(!row) {
            throw new NotFound();
        }
        return Txo.fromRow(row);
    }

    static fromRow(row: any) {
        const txo = new Txo();
        txo.txid = row.txid && row.txid.toString('hex');
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

    static async loadFileByOutpoint(outpoint: Outpoint) {
        const tx = await loadTx(outpoint.txid.toString('hex'));
        return Txo.parseOutputScript(tx.txOuts[outpoint.vout].script);
    }

    static async loadFileByTxid(txid: string): Promise<InscriptionData | undefined> {
        const tx = await loadTx(txid);
        for (let txOut of tx.txOuts) {
            const data = await this.parseOutputScript(txOut.script);
            if (data) return data;
        }
        return;
    }

    static parseOutputScript(script: Script): InscriptionData | undefined {
        let opFalse = 0;
        let opIf = 0;
        for (let [i, chunk] of script.chunks.entries()) {
            if (chunk.opCodeNum === OpCode.OP_FALSE) {
                opFalse = i;
            }
            if (chunk.opCodeNum === OpCode.OP_IF) {
                opIf = i;
            }
            if (chunk.buf?.equals(ORD) && opFalse === i - 2 && opIf === i - 1) {
                let insData = new InscriptionData();
                for (let j = i + 1; j < script.chunks.length; j += 2) {
                    if (script.chunks[j].buf) break;
                    switch (script.chunks[j].opCodeNum) {
                        case OpCode.OP_0:
                            insData.data = script.chunks[j + 1].buf;
                            return insData;
                        case OpCode.OP_1:
                            insData.type = script.chunks[j + 1].buf?.toString('utf8');
                            break;
                        case OpCode.OP_ENDIF:
                            break;
                    }
                }
            }
            if (chunk.buf?.equals(B)) {
                let insData = new InscriptionData();
                insData.data = script.chunks[i+1]?.buf;
                insData.type = script.chunks[i+2]?.buf?.toString()
                return insData;
            }
        }
        return;
    }
}