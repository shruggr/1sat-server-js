import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import * as express from 'express';
import { Request, Response } from 'express';
import { NotFound } from 'http-errors';
import "isomorphic-fetch";
import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from "./build/routes";
import * as path from 'path';
import { Redis } from 'ioredis';
import * as responseTime from 'response-time'
import { redis } from './db';
// import { pool } from './db';

const { PORT, REDISDB } = process.env;
const server = express();

async function main() {
    const port = PORT || 8081
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

server.set('trust proxy', true);
server.use(cors({
    origin: true,
}));
server.use(express.json({ limit: '150mb' }));
server.use(express.raw({type: 'application/octet-stream', limit: '100mb'}))
server.use(responseTime(async (req, res, time) => {
    const reqTime = new Date();
    console.log(reqTime.toISOString(), req.path, req.method, `${time}ms`);
    // await pool.query(`INSERT INTO request_log(method, path, apikey, status, duration)
    //     VALUES($1, $2, $3, $4, $5)`, 
    //     [req.method, req.path, req.headers['API_KEY'], res.statusCode, time])
}))

// server.use(async (req, res, next) => {
//     const reqTime = new Date();
//     console.log(reqTime.toISOString(), req.path, req.method);
//     try {
//         next();
//         await pool.query(`INSERT INTO request_log(path, apikey, status, req_time, res_time)
//             VALUES($1, $2, $3, $4, $5)`, 
//             [req.path, req.headers['API_KEY'], res.statusCode, reqTime, new Date()])
//     } catch (e) {
//         console.error('[LOGGER] Error:', e);
//     }
// });

server.use('/api/swagger.json', async (_req, res) => {
    res.sendFile(path.join(__dirname, '/build/swagger.json'));
});


server.get("/api/subscribe", async (req, res, next) => {
    try {
        let channels: string[] = []
        
        if (Array.isArray(req.query['channel'])) {
            channels.push(...req.query['channel'] as string[]);
        } else if (typeof req.query['channel'] == 'string') {
            channels.push(req.query['channel']);
        }

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        });
        const rparts = (REDISDB || '').split(':')
        const subClient = new Redis({
            port: rparts[1] ? parseInt(rparts[1]) : 6379,
            host: rparts[0],
        });
        subClient.subscribe(...channels.map(c => `evt:${c}`));
        const lastEventId = parseInt(req.get('last-event-id') || '0');
        if (lastEventId) {
            console.log('SSE Last-Event-ID:', lastEventId)
            for (let c of channels) {
                const events = await redis.zrangebyscore(`evt:${c}`, lastEventId, '+inf', 'WITHSCORES')
                for (let i = 0; i < events.length; i += 2) {
                    const message = events[i ]
                    const id = events[i + 1]
                    publishMessage(res, c, message, id)
                }
            }
        }
        console.log(new Date(), 'SSE Subscribe:', ...channels)
        const interval = setInterval(() => res.write('event: ping\n'), 5000)

        res.on("close", () => {
            clearInterval(interval)
            subClient.quit()
            console.log(new Date(), 'SSE Close')
        })

        subClient.on("message", async (channel, message) => {
            const [, event] = channel.split(':', 2)
            const [id] = message.split(':', 2)
            const data = message.slice(id.length + 1)

            // let id = ''
            // if (channel.startsWith('t:') || channel.startsWith('s:')) {
            //     const address = Utils.toBase58Check(Utils.toArray(channel.slice(2), 'hex'))
            //     channel = channel.slice(0, 2) + address
            // }
            publishMessage(res, event, data, id)
            // res.write(`event: ${event}\n`)
            // res.write(`data: ${message}\n`)
            // if (id) {
            //     res.write(`id: ${id}\n\n`)
            // } else {
            //     res.write(`\n`)
            // }
        });
        // setTimeout(() => res.end(), 60000)
    } catch (e: any) {
        return next(e);
    }
});

function publishMessage(res: Response, event: string, message: string, id?: string) {
    console.log(new Date(), 'SSE Message:', event, message, id)
    res.write(`event: ${event}\n`)
    res.write(`data: ${message}\n`)
    if (id) {
        res.write(`id: ${id}\n\n`)
    } else {
        res.write(`\n`)
    }
}

const { BITCOIN_HOST, BITCOIN_PORT } = process.env;
server.get('/rest/*', async (req, res, next) => {
    try {
        const url = `http://${BITCOIN_HOST}:${BITCOIN_PORT}${req.originalUrl}`
        console.log('REST:', url)
        const resp = await axios.get(url, {
            responseType: 'stream'
        });
        for (let [k, v] of Object.entries(resp.headers)) {
            res.set(k, v);
        }
        resp.data.pipe(res);
    } catch (e: any) {
        let status = 500
        if (e.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(e.response.data);
            console.log(e.response.status);
            console.log(e.response.headers);
            status = e.response.status;
        } else if (e.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(e.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', e.message);
        }
        console.log(e.config);
        next(new Error(`${status} ${e.message}`))
    };
})

server.use("/api/docs",
    swaggerUi.serve,
    async (_req: Request, res: Response) => {
        return res.send(
            swaggerUi.generateHTML(await import("./build/swagger.json"))
        );
    });

RegisterRoutes(server);

server.use('/playground', express.static("playground"));
server.use((req, res, next) => {
    console.log(req.path)
    next(new NotFound("Not Found"));
});

server.use((err, req, res, next) => {
    console.error(req.path, err.status || 500, err);
    res.status(err.status || 500).json({ message: err.message })
});

main().catch(console.error);