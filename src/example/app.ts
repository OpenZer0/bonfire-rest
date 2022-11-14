import express, { Express, Request, Response } from 'express';
import { UserController } from './controllers/User.controller';
import { ServerBuilder } from '../lib/ServerBuilder';

async function main() {
    const app: Express = express();
    const port = process.env.PORT || 3001;

    const server = await ServerBuilder.build({
        controllers: [UserController],
        express: app,
    });
    server.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
    });

    console.log(server.get.toString())

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    });
}

main();
