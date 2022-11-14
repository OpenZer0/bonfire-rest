import { Request, Response } from 'express';
import { Body } from '../../lib/decorators/Body.decorator';
import { Endpoint } from '../../lib/decorators/Endpoint';
import { Req } from '../../lib/decorators/Request.decorator';
import { Res } from '../../lib/decorators/Response.decorator';
import { Query } from '../../lib/decorators/Query.decorator';
import { Headers } from '../../lib/decorators/Headers.decorator';
import { Param } from '../../lib/decorators/param.decorator';

export class UserController {
    @Endpoint({ method: 'get', route: '/users' })
    getUsers(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query({ key: 'test' }) query: any,
        @Headers({ key: 'host' }) headers,
    ) {
        res.send([{ usnername: 'krisz' }]);
    }

    @Endpoint({ method: 'get', route: '/users/:id' })
    getUsersByid(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query({ key: 'test' }) query: any,
        @Headers({ key: 'host' }) headers,
        @Param({ key: 'id' }) id: string,
    ) {
        console.log('id', id);
        res.send({ usnername: id });
    }

    @Endpoint({ method: 'post', route: '/users' })
    getUsers2(@Req() req: Request, @Res() res: Response, @Body() body: any, @Body() body2: any) {
        res.send([{ usnername: 'krisz' }]);
    }
}