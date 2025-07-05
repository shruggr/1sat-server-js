import { Transaction } from "@bsv/sdk";
import createError from "http-errors";
import { cache, redis } from "./db";

const { NETWORK, ARC, ARC_AUTH_TOKEN, ARC_CALLBACK_URL, ARC_CALLBACK_TOKEN, INDEXER } = process.env;

export async function broadcastTx(tx: Transaction): Promise<string> {
    const txid = tx.id('hex') as string;
    console.time('Broadcast: ' + txid);
    
    const txbuf = Buffer.from(tx.toBinary());
    await cache.set(`tx:${txid}`, txbuf);
    
    try {
        // 1. Start listening for callbacks BEFORE submitting to Arc
        const callbackPromise = startCallbackListener(txid, 120000); // 2 minute total timeout
        
        // 2. Submit to Arc (30 second timeout max)
        const initialStatus = await submitToArc(tx);
        
        // 3. If we got a final status immediately, we're done
        if (isFinalStatus(initialStatus)) {
            console.timeLog('Broadcast: ' + txid, `Got final status from Arc: ${initialStatus}`);
            
            // Cleanup callback listener since we don't need it
            callbackPromise.cancel();
            
            if (isErrorStatus(initialStatus)) {
                throw createError(400, `Transaction broadcast failed: ${initialStatus}`);
            }
            
            // Success - publish and return
            console.timeLog('Broadcast: ' + txid, "Publishing to redis");
            await fetch(`${INDEXER}/tx/${txid}/ingest`).catch((e) => console.error("Ingestion error:", e));
            await redis.publish("broadcast", txbuf.toString('base64'));
            return txid;
        }
        
        // 4. Not final status yet - continue waiting on callback listener
        console.timeLog('Broadcast: ' + txid, `Got intermediate status: ${initialStatus}, waiting for callback`);
        const finalStatus = await callbackPromise.promise;
        
        if (isErrorStatus(finalStatus)) {
            throw createError(400, `Transaction broadcast failed: ${finalStatus}`);
        }
        
        // Success - publish and return
        console.timeLog('Broadcast: ' + txid, "Publishing to redis");
        await fetch(`${INDEXER}/tx/${txid}/ingest`).catch((e) => console.error("Ingestion error:", e));
        await redis.publish("broadcast", txbuf.toString('base64'));
        return txid;
        
    } catch (e: any) {
        console.error("Broadcast Error:", e);
        throw e;
    } finally {
        console.timeEnd('Broadcast: ' + txid);
    }
}

export async function broadcastWOC(tx: Transaction) {
    const net = NETWORK == 'testnet' ? 'test' : 'main'
    const resp = await fetch(`https://api.whatsonchain.com/v1/bsv/${net}/tx/raw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txhex: tx.toHex() })
    });

    const respText = await resp.text();
    console.log("WOC Response:", resp.status, respText);
    if (!resp.ok) {
        try {
            // const { status, error } = JSON.parse(respText);
            // if (!error.includes('txn-already-known')) {
            throw createError(resp.status || 500, `Broadcast failed: ${respText}}`);
            // }
        } catch (e: any) {
            throw e;
        }
    }
}

// Start callback listener and return cancellable promise
function startCallbackListener(txid: string, timeoutMs: number): { promise: Promise<string>, cancel: () => void } {
    let resolved = false;
    let subscriber: any;
    let timeout: NodeJS.Timeout;
    
    const cleanup = () => {
        if (!resolved) {
            resolved = true;
            if (subscriber) {
                subscriber.unsubscribe();
                subscriber.quit();
            }
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    };
    
    const promise = new Promise<string>((resolve, reject) => {
        subscriber = redis.duplicate();
        const channel = `stat:${txid}`;
        subscriber.subscribe(channel);
        
        subscriber.on('message', (receivedChannel: string, message: string) => {
            if (resolved || receivedChannel !== channel) return;
            
            try {
                const update = JSON.parse(message);
                
                // Only resolve on final status
                if (isFinalStatus(update.txStatus)) {
                    cleanup();
                    console.log(`Got final status via callback: ${txid} -> ${update.txStatus}`);
                    resolve(update.txStatus);
                } else {
                    // Log intermediate status but keep waiting
                    console.log(`Callback intermediate status: ${txid} -> ${update.txStatus}`);
                }
            } catch (e) {
                console.error('Error parsing callback message:', e);
            }
        });
        
        // Timeout fallback - query Arc status directly
        timeout = setTimeout(async () => {
            if (resolved) return;
            cleanup();
            
            try {
                console.log(`No final callback received for ${txid} within ${timeoutMs}ms, querying Arc directly`);
                const status = await queryArcTransactionStatus(txid);
                resolve(status);
            } catch (e) {
                reject(e);
            }
        }, timeoutMs);
        
        // Handle Redis connection errors
        subscriber.on('error', (err: Error) => {
            if (!resolved) {
                cleanup();
                reject(new Error(`Redis subscription error for ${txid}: ${err.message}`));
            }
        });
    });
    
    return {
        promise,
        cancel: cleanup
    };
}

// Submit to Arc and return whatever status we get (final or intermediate)
async function submitToArc(tx: Transaction): Promise<string> {
    const txid = tx.id('hex') as string;
    
    // TODO: Use EF format when ready
    // let txbuf: Buffer
    // try {
    //     await Promise.all(tx.inputs.map(async txIn => {
    //         if (txIn.sourceTransaction) return
    //         txIn.sourceTransaction = await loadTx(txIn.sourceTXID!)
    //     }))
    //     txbuf = Buffer.from(tx.toEF());
    // } catch (e) {
    //     console.error("Error loading txos", txid, e)
    //     txbuf = Buffer.from(tx.toBinary());
    // }
    
    const txbuf = Buffer.from(tx.toBinary());
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/octet-stream',
        'X-WaitFor': 'SEEN_ON_NETWORK', // Try to get final status
        'X-MaxTimeout': '30', // Arc will timeout after 30 seconds
        'X-FullStatusUpdates': 'true',
    };
    
    if (ARC_CALLBACK_URL) {
        headers['X-CallbackUrl'] = ARC_CALLBACK_URL;
    }
    if (ARC_CALLBACK_TOKEN) {
        headers['X-CallbackToken'] = ARC_CALLBACK_TOKEN;
    }
    if (ARC_AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${ARC_AUTH_TOKEN}`;
    }
    
    const logLabel = 'ARC Submit: ' + txid;
    console.time(logLabel);
    console.timeLog(logLabel, "headers:", JSON.stringify(headers));
    
    const resp = await fetch(`${ARC}/v1/tx`, {
        method: 'POST',
        headers,
        body: txbuf,
    });
    
    const respText = await resp.text();
    console.timeLog(logLabel, resp.status, respText);
    console.timeEnd(logLabel);
    
    // Handle HTTP errors and Arc response parsing
    if (!resp.ok) {
        let errorMessage = `HTTP ${resp.status}: ${respText}`;
        try {
            const errorResult = JSON.parse(respText);
            if (errorResult.detail) {
                errorMessage = `${errorResult.detail} ${errorResult.extraInfo || ''}`;
            }
        } catch (e) {
            // Use raw response if JSON parsing fails
        }
        throw createError(resp.status, `Arc broadcast failed for ${txid}: ${errorMessage}`);
    }
    
    let result: any;
    try {
        result = JSON.parse(respText);
    } catch (e) {
        throw createError(500, `Invalid JSON response from Arc for ${txid}: ${respText}`);
    }
    
    if (result.status && result.status !== 200) {
        const detail = result.detail || '';
        const extraInfo = result.extraInfo || '';
        throw createError(result.status, `Arc internal error for ${txid}: ${detail} ${extraInfo}`);
    }
    
    if (isErrorStatus(result.txStatus)) {
        const detail = result.detail || '';
        const extraInfo = result.extraInfo || '';
        throw createError(400, `Transaction ${txid} ${result.txStatus}: ${detail} ${extraInfo}`);
    }
    
    return result.txStatus;
}

// Helper functions
function isFinalStatus(status: string): boolean {
    return ['SEEN_ON_NETWORK', 'MINED', 'CONFIRMED', 'REJECTED', 'DOUBLE_SPEND_ATTEMPTED', 'SEEN_IN_ORPHAN_MEMPOOL'].includes(status);
}

function isErrorStatus(status: string): boolean {
    return ['REJECTED', 'DOUBLE_SPEND_ATTEMPTED', 'SEEN_IN_ORPHAN_MEMPOOL'].includes(status);
}

// Query Arc transaction status endpoint
async function queryArcTransactionStatus(txid: string): Promise<string> {
    const resp = await fetch(`${ARC}/v1/tx/${txid}`, {
        headers: ARC_AUTH_TOKEN ? { 'Authorization': `Bearer ${ARC_AUTH_TOKEN}` } : {}
    });
    
    if (!resp.ok) {
        throw createError(resp.status, `Failed to query status for ${txid}`);
    }
    
    const result = await resp.json();
    return result.txStatus;
}
