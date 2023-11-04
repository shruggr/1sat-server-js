import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import { Address } from '@ts-bitcoin/core';
import * as express from 'express';
import { Request, Response } from 'express';
import { NotFound } from 'http-errors';
import "isomorphic-fetch";
import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from "./build/routes";
import axios from 'axios';
import { Redis } from 'ioredis';

const server = express();

async function main() {
    // const PORT = process.env.PORT || 8081;
    const PORT = 8081;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

server.set('trust proxy', true);
server.use(cors({
    origin: true,
}));
server.use(express.json({ limit: '50mb' }));
server.use(express.raw({type: 'application/octet-stream'}))
server.use((req, res, next) => {
    console.log(new Date().toISOString(), req.path, req.method);
    next();
})

server.use("/api/subscribe", (req, res, next) => {
    try {
        let channels: string[] = []
        let addresses: string[] = [];
        if (Array.isArray(req.query['address'])) {
            addresses = req.query['address'] as string[];
        } else if (typeof req.query['address'] == 'string') {
            addresses = [req.query['address']]
        }
        for (let a of addresses) {
            const address = Address.fromString(a);
            channels.push(`t:${address.hashBuf.toString('base64')}`)
            channels.push(`s:${address.hashBuf.toString('base64')}`)
        }
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
        const subClient = new Redis();
        subClient.subscribe(...channels);
        const interval = setInterval(() => res.write('event: ping\n'), 5000)

        res.on("close", () => {
            clearInterval(interval)
            subClient.quit()
        })

        subClient.on("message", async (channel, message) => {
            let id = ''

            res.write(`event: ${channel}\n`)
            res.write(`data: ${message}\n`)
            if (id) {
                res.write(`id: ${id}\n\n`)
            } else {
                res.write(`\n`)
            }
        });
        // setTimeout(() => res.end(), 60000)
    } catch (e: any) {
        return next(e);
    }
});

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

server.use((req, res, next) => {
    console.log(req.path)
    next(new NotFound("Not Found"));
});

server.use((err, req, res, next) => {
    console.error(req.path, err.status || 500, err);
    res.status(err.status || 500).json({ message: err.message })
}); 

main().catch(console.error);