import express, { Express, Request, Response } from 'express';
import { UserController } from './controllers/User.controller';
import { ServerBuilder } from '../lib/ServerBuilder';

async function main() {
    const app: Express = express();
    const port = process.env.PORT || 3000;

    const server = await ServerBuilder.build({
        controllers: [UserController],
        express: app,
    });

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    });
}

main();
