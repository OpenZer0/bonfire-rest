import express, { Express, Request, Response } from 'express';
import { UserController } from './controllers/user.controller';
import { ServerBuilder } from '../lib/server-builder';
import {ValidationPipe} from "../lib/services/pipe/validation.pipe";
import { LogMiddleware } from "./middlewares/log.middleware";

async function main() {
    const app: Express = express();
    const port = process.env.PORT || 3000;

    const server = await ServerBuilder.build({
        controllers: [UserController],
        server: app,
        globalPipes: [ValidationPipe],
        globalPrefix: "api",
        globalMiddlewares: [LogMiddleware]
    });

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

main();
