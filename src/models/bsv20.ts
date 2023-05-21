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

    static fromRow(row: any): Bsv20 {
        return {
            id: Outpoint.fromBuffer(row.id),
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
            lock: row.lock.toString('hex'),
            spend: row.spend?.toString('hex'),
            MAP: row.map,
            B: row.b,
            valid: row.valid
        }
    }
}
