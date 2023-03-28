import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
// import * as createError from 'http-errors'
import { HttpError, NotFound } from 'http-errors';
import "isomorphic-fetch";
import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from "./build/routes";
import { createServer } from "http";
import { Server } from "socket.io";
// import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

const server = express();
const httpServer = createServer(server);
const pubClient = new Redis();
// const subClient = pubClient.duplicate();
const io = new Server(httpServer, { 
    // adapter: createAdapter(pubClient, subClient),
    cors: {
        origin: true,
    }
});

io.on("connection", (socket) => {
    const subClient = pubClient.duplicate();
    socket.on("message", (message, cb) => {
        console.log(message);
        cb("ok");
    });

    socket.on("subscribe", (channel) => {
        subClient.subscribe(channel);
    });

    socket.on("disconnect", () => subClient.quit());

    subClient.on("message", (channel, message) => {
        socket.emit(channel, message);
    });
});

async function main() {
    const PORT = process.env.PORT || 8080;
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}


server.set('trust proxy', true);
server.use(cors({
    origin: true,
}));
server.use(express.json({ limit: '50mb' }));
server.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
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
const errorMiddleware = ((err: TypeError | HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(req.path, (err as HttpError).status || 500, err);
    res.status((err as HttpError).status || 500).json({ message: err.message })
}) as ErrorRequestHandler

server.use(errorMiddleware);

main().catch(console.error);