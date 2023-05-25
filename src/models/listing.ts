import { NotFound } from 'http-errors';
import { pool } from "../db";
import { Outpoint } from "./outpoint";

export enum ListingSort {
    recent = 'recent',
    num = 'num',
    price = 'price',
}

export enum SortDirection {
    asc = 'asc',
    desc = 'desc',
    ASC = 'ASC',
    DESC = 'DESC',
}

export class Listing {
    txid: string = '';
    vout: number = 0;
    height: number = 0;
    idx: number = 0;
    price: number = 0;
    payout: string = '';
    script: string = '';
    origin: Outpoint = new Outpoint();
    
    static async loadOneByOutpoint(outpoint: Outpoint): Promise<Listing> {
        const { rows } = await pool.query(`
            SELECT *
            FROM ordinal_lock_listings 
            WHERE txid = $1 AND vout = $2`,
            [outpoint.txid, outpoint.vout],
        );
        if (rows.length === 0) {
            throw new NotFound('not-found');
        }
        return Listing.fromRow(rows[0]);
    }

    static fromRow(row: any) {
        const listing = new Listing();
        listing.txid = row.txid.toString('hex');
        listing.vout = row.vout;
        listing.height = row.height;
        listing.idx = row.idx;
        listing.price = parseInt(row.price, 10);
        listing.payout = row.payout.toString('base64');
        listing.origin = Outpoint.fromBuffer(row.origin);
        return listing;
    }
}