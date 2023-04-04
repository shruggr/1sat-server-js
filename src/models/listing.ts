import { pool } from "../db";
import { Outpoint } from "./outpoint";
import { Inscription } from "./inscription";

export class Listing {
    txid: string = '';
    vout: number = 0;
    height: number = 0;
    idx: number = 0;
    price: number = 0;
    payout: string = '';
    script: string = '';
    origin: Outpoint = new Outpoint();

    static async loadByTxidVout(txid: Buffer, vout: number): Promise<Inscription[]> {
        const { rows } = await pool.query(`
            SELECT *
            FROM listings 
            WHERE txid = $1 AND vout = $2`,
            [txid, vout],
        );
        return rows.map((r: any) => Inscription.fromRow(r));
    }

    static fromRow(row: any) {
        const listing = new Listing();
        listing.txid = row.txid.toString('hex');
        listing.vout = row.vout;
        listing.height = row.height;
        listing.idx = row.idx;
        listing.price = parseInt(row.price, 10);
        listing.payout = row.payout.toString('hex');
        listing.origin = Outpoint.fromBuffer(row.origin);
        return listing;
    }
}