import { Transaction } from "@bsv/sdk"
import { pool, redis } from "../db"

const { JUNGLEBUS } = process.env

export interface TxLog {
    txid: string
    height?: number
    idx?: number
}

export async function saveTxLog(address: string, txid: string, tags: string[] = []) {
    const pipe = redis.pipeline()
    pipe.zadd(`txlog:${address}`, Date.now(), txid!)
    // tags.forEach(tag => pipe.zadd(`txtag:${tag}:${address}`, Date.now(), txid!))
    await pipe.exec()
}

export async function deleteTxLog(address: string, txid: string) {
    return redis.zrem(`txlog:${address}`, txid)
}

export function parseRawTx(txbuf: number[], format: 'tx' | 'ef' | 'beef'): Transaction {
    return format == 'tx' ?
        Transaction.fromBinary(txbuf) :
        format == 'beef' ?
            Transaction.fromBEEF(txbuf) :
            Transaction.fromEF(txbuf);
}

export async function loadTxLogs(address: string, fromHeight: number, offset: number, limit: number): Promise<TxLog[]> {
    const key = `txlog:${address}`
    const txns = await redis.zrangebyscore(key, fromHeight, '+inf', 'WITHSCORES', 'LIMIT', offset, limit);
    const out: TxLog[] = []
    for (let i = 0; i < txns.length; i += 2) {
        const txid = txns[i]
        const score = txns[i + 1]
        const [heightStr, idxStr] = score.split('.')
        const log: TxLog = { txid }
        const height = parseInt(heightStr)
        if (height < 50000000) {
            log.height = height
            log.idx = parseInt(idxStr)
        }
        out.push(log)
    }
    return out

}

export async function refreshTxLogs(address: string): Promise<void> {
    const key = `txlog:${address}`
    const latest = await redis.zrevrangebyscore(key, 9999999, 0, 'WITHSCORES', 'LIMIT', 0, 1)
    let syncFrom = latest[1] ? parseInt(latest[1]) - 5 : 0

    const url = `${JUNGLEBUS}/v1/address/get/${address}/${syncFrom}`
    const resp = await fetch(url)
    const results = await resp.json() as { transaction_id: string, block_height: number, block_index: number }[]

    const toUpdate = new Set<string>()
    for (const tx of results) {
        let scoreStr = await redis.zscore(key, tx.transaction_id)
        const height = scoreStr ? parseInt(scoreStr) : 0
        if (!height || height > 50000000) {
            toUpdate.add(tx.transaction_id)
        }
    }

    const { rows } = await pool.query(`
            SELECT txid, height, idx, created
            FROM txns
            WHERE txid = ANY($1)`,
        [Array.from(toUpdate).map(txid => Buffer.from(txid, 'hex'))]
    );
    const pipe = redis.pipeline()
    for (const { txid, height, idx, created } of rows) {
        let score = height ?
            `${height}.${idx.toString().padStart(8, '0')}` :
            created.getTime()
        const txidHex = txid.toString('hex')
        pipe.zadd(key, score, txidHex)
        toUpdate.delete(txidHex)
    }
    for (const txid of toUpdate) {
        pipe.zadd(key, Date.now(), txid)
        redis.publish('submit', txid);
    }
    await pipe.exec()

}