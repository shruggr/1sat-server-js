import { Address, Hash, OpCode, Script } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { pool } from "./db";

export class Txo {
    txid: string = '';
    vout: number = 0;
    satoshis: number = 0;
    accSats: number = 0;
    lock: string = '';
    spend: string = '';
    origin: Origin = new Origin();
    height: number = 0;
    idx: number = 0;

    static async loadUtxosByLock(lock: string): Promise<Txo[]> {
        const { rows } = await pool.query(`
            SELECT * 
            FROM txos 
            WHERE lock = $1 AND spend IS NULL`,
            [Buffer.from(lock, 'hex')],
        );
        return rows.map((r: any) => Txo.fromRow(r));
    }

    static async loadUtxosByAddress(address: string): Promise<Txo[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        )
            .reverse()
            .toString('hex');
        return Txo.loadUtxosByLock(lock);
    }

    static fromRow(row: any) {
        const txo = new Txo();
        txo.txid = row.txid.toString('hex');
        txo.vout = row.vout;
        txo.satoshis = row.satoshis;
        txo.accSats = row.accsats;
        txo.lock = row.lock.toString('hex');
        txo.spend = row.spend?.toString('hex');
        txo.origin = Origin.fromBuffer(row.origin);
        txo.height = row.height;
        txo.idx = row.idx;
        return txo;
    }
}

export class Origin {
    txid: Buffer = Buffer.alloc(32);
    vout: number = 0;

    toString() {
        return this.txid.toString('hex') + '_' + this.vout;
    }

    toBuffer() {
        return Buffer.concat([
            this.txid,
            Buffer.from(this.vout.toString(16).padStart(8, '0'), 'hex'),
        ]);
    }

    static fromString(str: string) {
        const origin = new Origin();
        origin.txid = Buffer.from(str.slice(0, 64), 'hex');
        origin.vout = parseInt(str.slice(65), 10);
        return origin;
    }

    static fromBuffer(buf: Buffer) {
        const origin = new Origin();
        origin.txid = buf.slice(0, 32);
        origin.vout = parseInt(buf.slice(32).toString('hex'), 16);
        return origin;
    }

    toJSON() {
        return this.toString();
    }
}

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
    txid: string = '';
    vout: number = 0;
    file?: File;
    origin: Origin = new Origin();
    height: number = 0;
    idx: number = 0;
    lock: string = '';

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

    static async loadOneByOrigin(origin: Origin): Promise<Inscription> {
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

    static fromRow(row: any): Inscription {
        const inscription = new Inscription();
        inscription.id = row.id;
        inscription.txid = row.txid.toString('hex');
        inscription.vout = row.vout;
        inscription.file = new File();
        inscription.file.hash = row.filehash.toString('hex');
        inscription.file.size = row.filesize;
        inscription.file.type = row.filetype.toString('utf8');
        inscription.origin = Origin.fromBuffer(row.origin);
        inscription.height = row.height;
        inscription.idx = row.idx;
        inscription.lock = row.lock.toString('hex');
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
