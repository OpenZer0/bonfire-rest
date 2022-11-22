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
import { Controller, Post } from "../../lib";
import { OtherValidator, UserValidator } from "../user.validator";
import { ApiDocs } from "../../lib/decorators/openapi/result.decorator";
import { NotImplementedError } from "../../lib/error/http/bad-request.error";

@Controller( "ddd")
export class UserController {
    constructor(private readonly foo: FooService) {}

    @ApiDocs({resultType: UserValidator})
    @Get('/test')
    async getUsers(
      @Req() req: Request,
      @Res() res: Response,
      @Query('test', [UpperCasePipe]) query: any,
      @Headers('host', [UpperCasePipe]) headers: string,
    ) {
       throw new NotImplementedError("idk", ["test"])
    }

    @ApiDocs({resultType: UserValidator})
    @Get('/users/:id')
    getUsersByid(
        @Req() req: Request,
        @Res() res: Response,
        @Query('test' ) query: any,
        @Headers('host' ) headers,
        @Param('id' ) id: string,
    ) {
        console.log('id', id);
        res.send({ usnername: id });
    }

    @ApiDocs({resultType: OtherValidator})
    @Post("/t1/:asd/:param2/:param3")
    asd(
      @Req() req: Request,
      @Res() res: Response,
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
