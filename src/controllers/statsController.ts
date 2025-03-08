import { Controller, Get, Route } from "tsoa";
import { pool } from "../db";

@Route("api/stats")
export class StatsController extends Controller {
    @Get("")
    public async getStats(): Promise<{ indexer: string, height: number }> {
        this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        const { rows } = await pool.query(`SELECT * FROM progress`)
        const results: any = {}
        rows.forEach((row: any) => {
            results[row.indexer] = row.height
        })
        
        return results
    }
}