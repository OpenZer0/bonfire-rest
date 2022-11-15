import { Request, Response } from 'express';
import { Body } from '../../lib/decorators/body.decorator';
import { Endpoint } from '../../lib/decorators/endpoint.decorator';
import { Req } from '../../lib/decorators/request.decorator';
import { Res } from '../../lib/decorators/response.decorator';
import { Query } from '../../lib/decorators/query.decorator';
import { Headers } from '../../lib/decorators/headers.decorator';
import { Param } from '../../lib/decorators/param.decorator';
import { FooService } from '../services/foo.service';
import { UpperCasePipe } from '../services/upper.pipe';
import { Get } from '../../lib/decorators/method/get.decorator';
import {Controller} from "../../lib";
import {UserValidator} from "../user.validator";

@Controller()
export class UserController {
    constructor(private readonly foo: FooService) {}

    @Get('/test')
    getUsers(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query( 'test', [UpperCasePipe]) query: any,
        @Headers('host', [UpperCasePipe]) headers,
    ) {
        console.log(this.foo.getStr());
        console.log(this.foo.getStr());
        return [{ usnername: 'krisz' }];
    }

    @Endpoint({ method: 'get', route: '/users/:id' })
    getUsersByid(
        @Req({}) req: Request,
        @Res({}) res: Response,
        @Query('test' ) query: any,
        @Headers('host' ) headers,
        @Param('id' ) id: string,
    ) {
        console.log('id', id);
        res.send({ usnername: id });
    }

    @Endpoint({ method: 'post', route: '/users' })
    getUsers2(@Body('username') body: UserValidator) {
       return body
    }
}
