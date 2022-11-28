import { UserController } from './controllers/user.controller';
import { ServerBuilder } from '../lib/server-builder';
import {ValidationPipe} from "../lib/services/pipe/validation.pipe";
import { LogMiddleware } from "./middlewares/log.middleware";
import express from 'express';
import * as path from "path";
import { Env } from "../lib";

async function main() {
    const port = Env.asNumber("PORT", 3000);


    const app = express()
    const server = await ServerBuilder.build({
        controllers: [UserController],
        globalPipes: [ValidationPipe],
        server: app,
        globalMiddlewares: [LogMiddleware],
        openapi: {
            spec: {info: {title: "test project", version: "3", description: "this is the test project decription"}, openapi: "3.0.0"},
            swaggerUi: "/docs2",
            apiDocs: "docs"
        },
        assetFolders: [{root: "/assets", path: path.join(__dirname, "static")}]
    });

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

main();
