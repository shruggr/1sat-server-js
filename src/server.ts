import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
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
import * as proxy from 'express-http-proxy'
// import { pool } from './db';

const { PORT, REDISDB, V5 } = process.env;
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
server.use(responseTime(async (req, res, time) => {
    const reqTime = new Date();
    console.log(reqTime.toISOString(), req.path, req.method, `${time}ms`);
    // await pool.query(`INSERT INTO request_log(method, path, apikey, status, duration)
    //     VALUES($1, $2, $3, $4, $5)`, 
    //     [req.method, req.path, req.headers['API_KEY'], res.statusCode, time])
}))
server.use('/v5', proxy(V5 || '', {
    proxyReqPathResolver: (req) => '/v5' + req.url
}))
server.use(express.json({ limit: '150mb' }));
server.use(express.raw({ type: 'application/octet-stream', limit: '100mb' }))
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
                    const message = events[i]
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