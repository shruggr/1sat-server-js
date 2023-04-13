import { Address, Hash } from '@ts-bitcoin/core';
import { NotFound } from 'http-errors';
import { pool } from "../db";
import { Outpoint } from "./outpoint";
import { Inscription } from "./inscription";

export class Txo {
    txid: string = '';
    vout: number = 0;
    satoshis: number = 0;
    accSats: number = 0;
    lock: string = '';
    script: string = '';
    spend: string = '';
    origin: Outpoint = new Outpoint();
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

    static async loadHistoryByLock(lock: string): Promise<Txo[]> {
        const { rows } = await pool.query(`
            SELECT * 
            FROM txos 
            WHERE lock = $1 AND spend IS NOT NULL`,
            [Buffer.from(lock, 'hex')],
        );
        return rows.map((r: any) => Txo.fromRow(r));
    }

    static async loadHistoryByAddress(address: string): Promise<Txo[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        )
            .reverse()
            .toString('hex');
        return Txo.loadHistoryByLock(lock);
    }

    static async loadInscriptionsByLock(lock: string): Promise<Inscription[]> {
        const { rows } = await pool.query(`
            SELECT i.id, t.txid, t.vout, i.filehash, i.filesize, i.filetype, t.origin, t.height, t.idx, t.lock, t.spend, i.map, i.b
            FROM txos t
            JOIN inscriptions i ON i.origin=t.origin
            WHERE t.lock = $1 AND t.spend IS NULL
            ORDER BY i.id ASC`,
            [Buffer.from(lock, 'hex')],
        );
        return rows.map((r: any) => Inscription.fromRow(r));
    }

    static async loadInscriptionByOutpoint(outpoint: Outpoint): Promise<Inscription> {
        const { rows } = await pool.query(`
            SELECT i.id, t.txid, t.vout, i.filehash, i.filesize, i.filetype, t.origin, t.height, t.idx, t.lock, t.spend, i.map, i.b
            FROM txos t
            JOIN inscriptions i ON i.origin=t.origin
            WHERE t.txid=$1 AND t.vout=$2
            ORDER BY i.id ASC`,
            [outpoint.txid, outpoint.vout],
        );
        const ins = Inscription.fromRow(rows[0]);

        return ins;
    }

    static async loadInscriptionsByAddress(address: string): Promise<Inscription[]> {
        const lock = Hash.sha256(
            Address.fromString(address).toTxOutScript().toBuffer()
        )
            .reverse()
            .toString('hex');
        return Txo.loadInscriptionsByLock(lock);
    }

    static async loadOneByOrigin(origin: string): Promise<Txo> {
        const { rows } = await pool.query(`
            SELECT *
            FROM txos
            WHERE origin = $1 AND spend IS NULL`,
            [Outpoint.fromString(origin).toBuffer()],
        );
        if (rows.length === 0) throw new NotFound('Txo not found');
        return Txo.fromRow(rows[0]);
    }

    static fromRow(row: any) {
        const txo = new Txo();
        txo.txid = row.txid.toString('hex');
        txo.vout = row.vout;
        txo.satoshis = parseInt(row.satoshis, 10);
        txo.accSats = row.accsats;
        txo.lock = row.lock.toString('hex');
        txo.spend = row.spend?.toString('hex');
        txo.origin = Outpoint.fromBuffer(row.origin);
        txo.height = row.height;
        txo.idx = row.idx;
        return txo;
    }
}