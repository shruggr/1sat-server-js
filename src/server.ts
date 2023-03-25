import * as dotenv from 'dotenv';
dotenv.config();
import * as cors from 'cors';
import * as express from 'express';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import * as createError from 'http-errors'
import "isomorphic-fetch";
import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from "./build/routes";


const server = express();

async function main() {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}


server.set('trust proxy', true);
server.use(cors('*'));
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

const errorMiddleware = ((err: TypeError | createError.HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(req.path, (err as createError.HttpError).status || 500, err);
    res.status((err as createError.HttpError).status || 500).json({ message: err.message })
}) as ErrorRequestHandler

server.use(errorMiddleware);

main().catch(console.error);