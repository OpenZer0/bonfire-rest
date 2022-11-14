import { Endpoint } from '../src/lib/decorators/endpoint.decorator';
import { Req } from '../src/lib/decorators/request.decorator';
import { Res } from '../src/lib/decorators/response.decorator';
import { Query } from '../src/lib/decorators/query.decorator';
import { Headers } from '../src/lib/decorators/headers.decorator';
import express, { Express, Request, Response } from 'express';
import { ServerBuilder } from '../src/lib/server-builder';
import { Body } from '../src/lib/decorators/body.decorator';
import supertest from 'supertest';

export class UserController {
    @Endpoint({ method: 'get', route: '/users' })
    getUsers(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query({ key: 'test' }) query: any,
        @Headers({ key: 'host' }) headers,
    ) {
        console.log(query, headers);
        res.send([{ username: 'krisz' }]);
    }

    @Endpoint({ method: 'post', route: '/users' })
    getUsers2(@Req() req: Request, @Res() res: Response, @Body() body: any, @Body() body2: any) {
        console.log(body);
        res.send([{ username: 'krisz' }]);
    }
}

describe('POST', () => {
    test('add route POST /users and return with the correct response', async () => {
        const app: Express = express();
        const server = await ServerBuilder.build({
            controllers: [UserController],
            express: app,
        });

        const requestWithSupertest = supertest(server);
        const res = await requestWithSupertest.get('/users');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(JSON.stringify(res.body)).toBe(JSON.stringify([{ username: 'krisz' }]));
    });
});
