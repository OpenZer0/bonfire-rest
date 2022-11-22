import { UserController } from './controllers/user.controller';
import { ServerBuilder } from '../lib/server-builder';
import {ValidationPipe} from "../lib/services/pipe/validation.pipe";
import { LogMiddleware } from "./middlewares/log.middleware";
import express from 'express';
import * as path from "path";

async function main() {
    const port = process.env.PORT || 3000;


    const app = express()
    const server = await ServerBuilder.build({
        controllers: [UserController],
        globalPipes: [ValidationPipe],
        server: app,
        globalMiddlewares: [LogMiddleware],
        openapi: {
            title: "myApp",
            swaggerUi: "api-docs",
            apiDocs: "docs"
        },
        assetFolders: [{root: "/assets", path: path.join(__dirname, "static")}]
    });

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

main();
