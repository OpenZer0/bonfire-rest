import { Request, Response } from 'express';
import { Body } from '../../lib/decorators/body.decorator';
import { EndpointDecorator } from '../../lib/decorators/endpoint.decorator';
import { Req } from '../../lib/decorators/request.decorator';
import { Res } from '../../lib/decorators/response.decorator';
import { Query } from '../../lib/decorators/query.decorator';
import { Headers } from '../../lib/decorators/headers.decorator';
import { Param } from '../../lib/decorators/param.decorator';
import { FooService } from '../services/foo.service';
import { Injectable } from 'type-chef-di';

@Injectable()
export class UserController {
    constructor(private readonly foo: FooService) {}

    @EndpointDecorator({ method: 'get', route: '/users' })
    getUsers(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query({ key: 'test' }) query: any,
        @Headers({ key: 'host' }) headers,
    ) {
        console.log(this.foo.getStr());
        res.send([{ usnername: 'krisz' }]);
    }

    @EndpointDecorator({ method: 'get', route: '/users/:id' })
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

    @EndpointDecorator({ method: 'post', route: '/users' })
    getUsers2(@Req() req: Request, @Res() res: Response, @Body() body: any, @Body() body2: any) {
        res.send([{ usnername: 'krisz' }]);
    }
}
