import { NotFound } from 'http-errors';
import { pool } from "../db";
import { Outpoint } from "./outpoint";
import { Inscription } from './inscription';

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

    static async queryListings(sort: ListingSort, dir: SortDirection, limit: number, offset: number): Promise<Inscription[]> {
        let orderBy = 'ORDER BY ';
        switch(sort) {
            case ListingSort.num:
                orderBy += `l.num ${dir.toLowerCase() == SortDirection.asc ? 'ASC' : 'DESC'}`;
                break;
            case ListingSort.price:
                orderBy += `l.price ${dir.toLowerCase() == SortDirection.asc ? 'ASC' : 'DESC'}`;
                break;
            default:
                orderBy += `l.height ${dir.toLowerCase() == SortDirection.asc ? 'ASC' : 'DESC'}, l.idx ${dir.toLowerCase() == SortDirection.asc ? 'ASC' : 'DESC'}`;
        }
        const { rows } = await pool.query(`
            SELECT l.num as id, l.txid, l.vout, i.filehash, i.filesize, i.filetype, i.origin, l.height, l.idx, t.lock, l.spend, i.map, true as listing, l.price, l.payout
            FROM ordinal_lock_listings l
            JOIN inscriptions i ON i.origin=l.origin
            JOIN txos t ON t.txid=l.txid AND t.vout=l.vout
            WHERE l.spend = decode('', 'hex')
            ${orderBy}
            LIMIT $1 OFFSET $2`,
            [limit, offset],
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
        listing.payout = row.payout.toString('base64');
        listing.origin = Outpoint.fromBuffer(row.origin);
        return listing;
    }
}