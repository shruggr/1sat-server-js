import { Outpoint } from "./outpoint";

export class Bsv20 {
    id: Outpoint = new Outpoint();
    txid?: string;
    vout?: number;
    height: number = 0;
    idx: number = 0;
    tick: string = '';
    op?: string;
    max?: number;
    lim?: number;
    dec?: number;
    supply?: number;
    amt?: number;
    lock: string = '';
    spend: string = '';
    MAP?: {[key: string]: any};
    B?: File;
    valid?: boolean;
    accounts?: number;
    reason: string = '';
    unconfirmed?: number;
    available?: number;
    pctMinted?: number;
    price?: number;
    payout?: string;
    script?: string;

    static fromRow(row: any): Bsv20 {
        return {
            id: row.id && Outpoint.fromBuffer(row.id),
            txid: row.txid?.toString('hex'),
            vout: row.vout,
            height: row.height,
            idx: row.idx,
            tick: row.tick,
            op: row.op,
            max: row.max,
            lim: row.lim,
            dec: row.dec,
            supply: row.supply,
            amt: row.amt,
            lock: row.lock?.toString('hex'),
            spend: row.spend?.toString('hex'),
            MAP: row.map,
            B: row.b,
            valid: row.valid,
            reason: row.reason,
            unconfirmed: row.unconfirmed,
            available: row.available,
            pctMinted: row.pct_minted,
            accounts: row.accounts,
            price: row.price && parseInt(row.price, 10),
            payout: row.payout?.toString('base64')
        }
    }
}
