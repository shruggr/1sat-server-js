import { Address } from "@ts-bitcoin/core";
import { Outpoint } from "./outpoint";
import { Bsv20Status, TxoData } from "./txo";

export class Token {
    txid: string = '';
    vout: number = 0;
    height: number = 0;
    idx: number = 0;
    tick?: string;
    id?: Outpoint;
    sym?: string;
    icon?: string;
    max?: string;
    lim?: string;
    dec?: number;
    amt?: string;
    supply?: string;
    status: Bsv20Status = 0;
    available?: string;
    pctMinted?: number;
    accounts?: number;
    pending?: string;
    pendingOps? = 0;
    included = false;
    fundAddress?: string;
    fundTotal = 0;
    fundUsed = 0;
    fundBalance = 0;
    data?: TxoData;

    static fromRow(row: any) {
        const txo = new Token();
        txo.txid = row.txid && row.txid.toString('hex');
        txo.vout = row.vout;
        txo.height = row.height;
        txo.idx = row.idx;
        txo.tick = row.tick;
        txo.id = row.id && Outpoint.fromBuffer(row.id).toString();
        txo.sym = row.sym;
        txo.icon = row.icon &&  Outpoint.fromBuffer(row.icon).toString();
        txo.amt = row.amt;
        txo.status = row.status;
        txo.max = row.max;
        txo.lim = row.lim;
        txo.dec = row.dec;
        txo.amt = row.amt;
        txo.supply = row.supply;
        txo.available = row.available;
        txo.pctMinted = row.pct_minted;
        txo.accounts = row.accounts;
        txo.pending = row.pending;
        txo.pendingOps = row.pending_ops;
        txo.included = row.included;
        txo.fundAddress = row.fund_pkhash && Address.fromPubKeyHashBuf(row.fund_pkhash).toString();
        txo.fundTotal = row.fund_total || 0;
        txo.fundUsed = row.fund_used || 0;
        txo.fundBalance = row.fund_balance || 0;
        txo.data = row.data;

        return txo;
    }
}