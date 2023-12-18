import { Address } from "@ts-bitcoin/core";
import { Outpoint } from "./outpoint";
import { Bsv20Status } from "./txo";

export class BSV20Txo {
    txid: string = '';
    vout: number = 0;
    outpoint: Outpoint = new Outpoint();
    owner?: string;
    script?: string;
    spend?: string;
    height: number = 0;
    idx: number = 0;
    op? = '';
    tick?: string;
    id?: string;
    amt: string = ''
    status: Bsv20Status = 0;
    reason? = '';
    listing = false;
    price?: number;
    payout?: string;
    pricePerUnit?: number;

    static fromRow(row: any) {
        const txo = new BSV20Txo();
        txo.txid = row.txid && row.txid.toString('hex');
        txo.vout = row.vout;
        txo.outpoint = new Outpoint(row.txid, row.vout);
        txo.owner = row.pkhash && Address.fromPubKeyHashBuf(row.pkhash).toString();
        txo.spend = row.spend?.toString('hex');
        txo.height = row.height;
        txo.idx = row.idx;
        txo.op = row.op;
        txo.tick = row.tick;
        txo.id = row.id && Outpoint.fromBuffer(row.id);
        txo.amt = row.amt;
        txo.status = row.status;
        txo.reason = row.reason;
        txo.listing = row.listing;
        txo.price = row.price;
        txo.payout = row.payout && row.payout.toString('base64')
        return txo;
    }
}