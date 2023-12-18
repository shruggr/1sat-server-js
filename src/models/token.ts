import { Outpoint } from "./outpoint";
import { Bsv20Status } from "./txo";

export class Token {
    txid: string = '';
    vout: number = 0;
    height: number = 0;
    idx: number = 0;
    tick?: string;
    id?: Outpoint;
    max?: string;
    lim?: string;
    dec?: number;
    amt?: string;
    supply?: string;
    status: Bsv20Status = 0;
    available?: string;
    pctMinted?: number;
    accounts?: number;
    pending?: number;
    included = false;

    static fromRow(row: any) {
        const txo = new Token();
        txo.txid = row.txid && row.txid.toString('hex');
        txo.vout = row.vout;
        txo.height = row.height;
        txo.idx = row.idx;
        txo.tick = row.tick;
        txo.id = row.id && Outpoint.fromBuffer(row.id).toString();
        txo.amt = row.amt;
        txo.status = row.status;
        txo.max = row.max;
        txo.lim = row.lim;
        txo.dec = row.dec;
        txo.amt = row.amt;
        txo.supply = row.supply;
        txo.available = row.available;
        txo.pctMinted = row.pct_minted;
        txo.accounts = row.account;
        txo.pending = row.pending || 0
        txo.included = row.included;

        return txo;
    }
}