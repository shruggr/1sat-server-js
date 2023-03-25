import { Pool } from 'pg';
const { POSTGRES } = process.env;

export const pool = new Pool({ connectionString: POSTGRES});