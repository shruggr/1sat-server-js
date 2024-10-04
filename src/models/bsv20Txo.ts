import { Address } from "@ts-bitcoin/core";
import { Outpoint } from "./outpoint";
import { Bsv20Status } from "./txo";

export class BSV20Txo {
    txid: string = '';
    vout: number = 0;
    outpoint: Outpoint = new Outpoint();
    owner?: string;
    satoshis = 1;
    script?: string;
    spend?: string;
    spendHeight?: number;
    spendIdx?: number;
    height: number = 0;
    idx: number = 0;
    op? = '';
    tick?: string;
    id?: string;
    sym?: string;
    dec?: number;
    icon?: string;
    amt: string = ''
    status: Bsv20Status = 0;
    reason? = '';
    listing = false;
    price?: number;
    pricePer?: number;
    payout?: string;
    pricePerUnit?: number;
    sale?: boolean;
    lock?: {
        address: string;
        until: number;
    }


    static fromRow(row: any) {
        const txo = new BSV20Txo();
        txo.txid = row.txid && row.txid.toString('hex');
        txo.vout = row.vout;
        txo.outpoint = new Outpoint(row.txid, row.vout);
        txo.owner = row.pkhash && Address.fromPubKeyHashBuf(row.pkhash).toString();
        txo.spend = row.spend?.toString('hex');
        txo.spendHeight = row.spend_height;
        txo.spendIdx = row.spend_idx;
        txo.height = row.height;
        txo.idx = row.idx;
        txo.op = row.op;
        txo.tick = row.tick;
        txo.id = row.id && Outpoint.fromBuffer(row.id);
        txo.sym = row.sym;
        txo.icon = row.icon && Outpoint.fromBuffer(row.icon);
        txo.dec = Number.isInteger(row.b2dec) ? row.b2dec : row.b1dec;
        txo.amt = row.amt;
        txo.status = row.status;
        txo.reason = row.reason;
        txo.listing = row.listing;
        txo.price = row.price;
        txo.pricePer = row.price_per_token
        txo.payout = row.payout && row.payout.toString('base64')
        txo.script = row.script && row.script.toString('base64')
        txo.sale = !!row.sale
        txo.lock = row.lock && JSON.parse(row.lock)

        return txo;
    }
}