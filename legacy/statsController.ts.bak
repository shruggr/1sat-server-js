import { Controller, Get, Route } from "tsoa";
import { pool } from "../db";

@Route("api/stats")
export class StatsController extends Controller {
    @Get("")
    public async getOpenListings(): Promise<{ settled: number, indexed: number }> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows: [{ settled }] } = await pool.query(`SELECT height as settled
            FROM progress
            WHERE indexer='node'`)
        const { rows: [{ indexed }] } = await pool.query(`SELECT MAX(height) as indexed 
            FROM txns
            WHERE height < 100000000`)

        return { settled, indexed }
    }
}