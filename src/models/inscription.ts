
import {JungleBusClient} from "@gorillapool/js-junglebus";
import { Hash, OpCode, Script, Tx } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { pool } from "../db";
import { Outpoint } from "./outpoint";

const jb = new JungleBusClient('https://junglebus.gorillapool.io');


export class File {
    hash: string = '';
    size: number = 0;
    type: string = '';
}

export class InscriptionData {
    type?: string = '';
    data?: Buffer = Buffer.alloc(0);
    lock: Buffer = Buffer.alloc(32);
}

export class Inscription {
    id?: number;
    num?: number;
    txid: string = '';
    vout: number = 0;
    file?: File;
    origin: Outpoint = new Outpoint();
    height: number = 0;
    idx: number = 0;
    lock: string = '';
    spend: string = '';
    MAP?: {[key: string]: string};
    B?: File;
    listing: boolean = false;
    price?: number;
    payout?: string;
    script?: string;


    static async loadOneById(id: number): Promise<Inscription> {
        const { rows } = await pool.query(`SELECT * 
            FROM inscriptions 
            WHERE id = $1
            LIMIT 1`,
            [id]
        )
        if (!rows.length) throw new NotFound('not-found');
        return Inscription.fromRow(rows[0]);
    }

    static async loadOneByOrigin(origin: Outpoint): Promise<Inscription> {
        const { rows } = await pool.query(`SELECT * 
            FROM inscriptions 
            WHERE origin = $1
            ORDER BY id DESC
            LIMIT 1`,
            [
                origin.toBuffer()
            ]
        )
        if (!rows.length) throw new NotFound('not-found');

        return Inscription.fromRow(rows[0]);
    }

    static async loadByOrigin(origin: Outpoint): Promise<Inscription[]> {
        const { rows } = await pool.query(`SELECT * 
            FROM inscriptions 
            WHERE origin = $1
            ORDER BY id DESC`,
            [
                origin.toBuffer()
            ]
        )
        if (!rows.length) throw new NotFound('not-found');
        return rows.map(row => Inscription.fromRow(row));
    }

    static async loadMetadataByOrigin(origin: Outpoint): Promise<Inscription[]> {
        const { rows } = await pool.query(`SELECT *
            FROM metadata
            WHERE origin = $1
            ORDER BY height DESC, idx DESC`,
            [origin.toBuffer()]
        )
        if (!rows.length) throw new NotFound('not-found');
        return rows.map(row => Inscription.metadataFromRow(row));
    }

    static async loadMetadataByTxid(txid: Buffer): Promise<Inscription[]> {
        const { rows } = await pool.query(`SELECT *
            FROM metadata
            WHERE txid = $1`,
            [txid]
        );
        if (!rows.length) throw new NotFound('not-found');
        return rows.map(row => Inscription.metadataFromRow(row));
    }

    static async loadByTxid(txid: Buffer): Promise<Inscription[]> {
        const { rows } = await pool.query(`SELECT *
            FROM inscriptions
            WHERE txid = $1
            ORDER BY vout ASC`,
            [
                txid
            ]
        )
        return rows.map(row => Inscription.fromRow(row));
    }

    static async loadFileByOrigin(origin: Outpoint) {
        const im = await Inscription.loadOneByOrigin(origin);
        const jbTxn = await jb.GetTransaction(im.txid);
        if(!jbTxn) throw new NotFound('not-found');
        const tx = Tx.fromBuffer(Buffer.from(jbTxn.transaction, 'base64'));
        return Inscription.parseOutputScript(tx.txOuts[im.vout].script);
    }

    static fromRow(row: any): Inscription {
        const inscription = new Inscription();
        inscription.id = row.id ? parseInt(row.id, 10) : undefined;
        inscription.num = inscription.id
        inscription.txid = row.txid.toString('hex');
        inscription.vout = row.vout;
        inscription.file = new File();
        inscription.file.hash = row.filehash?.toString('hex');
        inscription.file.size = row.filesize;
        inscription.file.type = row.filetype?.toString('utf8');
        inscription.origin = Outpoint.fromBuffer(row.origin);
        inscription.height = row.height;
        inscription.idx = row.idx;
        inscription.lock = row.lock?.toString('hex');
        inscription.spend = row.spend?.toString('hex');
        inscription.MAP = row.map;
        inscription.B = row.b;
        inscription.listing = row.listing || false;
        inscription.price = row.price ? parseInt(row.price, 10) : undefined;
        inscription.payout = row.payout?.toString('base64');
        return inscription;
    }

    static metadataFromRow(row: any): Inscription {
        const inscription = new Inscription();
        inscription.id = parseInt(row.id, 10);
        inscription.txid = row.txid.toString('hex');
        inscription.vout = row.vout;
        inscription.file = row.ord;
        inscription.origin = Outpoint.fromBuffer(row.origin);
        inscription.height = row.height;
        inscription.idx = row.idx;
        inscription.lock = row.lock?.toString('hex');
        inscription.MAP = row.map;
        inscription.B = row.b;
        return inscription;
    }

    static async count(): Promise<number> {
        const { rows } = await pool.query(`SELECT MAX(id) as count 
            FROM inscriptions`);
        return parseInt(rows[0].count, 10);
    }

    static parseOutputScript(script: Script): InscriptionData {
        let opFalse = 0;
        let opIf = 0;
        let opORD = 0;
        const lock = new Script();
        for(let [i, chunk] of script.chunks.entries()) {
            if(chunk.opCodeNum === OpCode.OP_FALSE) {
                opFalse = i;
            }
            if(chunk.opCodeNum === OpCode.OP_IF) {
                opIf = i;
            }
            if(chunk.buf?.equals(Buffer.from('ord', 'utf8'))) {
                if (opFalse === i - 2 && opIf === i - 1) {
                    opORD = i;
                    lock.chunks = script.chunks.slice(0, i - 2);
                    break;
                }
            }
            lock.chunks.push(chunk);
        }

        let insData = new InscriptionData();
        if (opORD === 0) {
            insData.lock = Hash.sha256(script.toBuffer()).reverse();
            return insData;
        }
        insData.lock = Hash.sha256(lock.toBuffer()).reverse();
        for(let i = opORD + 1; i < script.chunks.length; i+=2) {
            if (script.chunks[i].buf) break;
            switch(script.chunks[i].opCodeNum) {
                case OpCode.OP_0:
                    insData.data = script.chunks[i+1].buf;
                    break;
                case OpCode.OP_1:
                    insData.type = script.chunks[i+1].buf?.toString('utf8');
                    break;
                case OpCode.OP_ENDIF:
                    break;
            }
        }
        return insData;
    }
}