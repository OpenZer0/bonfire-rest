import { Request, Response } from 'express';
import { Body, BodyParam } from "../../lib/decorators/body.decorator";
import { Endpoint } from '../../lib/decorators/endpoint.decorator';
import { Req } from '../../lib/decorators/request.decorator';
import { Res } from '../../lib/decorators/response.decorator';
import { QueryParam } from '../../lib/decorators/query.decorator';
import { Header, Headers } from "../../lib/decorators/headers.decorator";
import { Param } from '../../lib/decorators/param.decorator';
import { FooService } from '../services/foo.service';
import { UpperCasePipe } from '../services/upper.pipe';
import { Get } from '../../lib/decorators/method/get.decorator';
import { Controller, HttpError, Post } from "../../lib";
import { OtherValidator, UserValidator } from "../user.validator";
import { ApiDocs } from "../../lib/decorators/openapi/result.decorator";
import { NotImplementedError } from "../../lib/error/http/bad-request.error";
import { LogMe, LogMiddleware2, LogMiddleware3 } from "../middlewares/log.middleware";
import { BeforeMiddleware } from "../../lib/decorators/middleware/before-middleware.decorator";
import { AfterMiddleware } from "../../lib/decorators/middleware/after-middleware.decorator";

@Controller()
export class UserController {
    constructor(private readonly foo: FooService) {}

    // @Middleware({beforeMiddlewares: [LogMiddleware2], afterMiddlewares: []})
    @BeforeMiddleware(LogMiddleware2)
    @BeforeMiddleware(new LogMe("this is an instance message"))
    @BeforeMiddleware(LogMiddleware2)
    @AfterMiddleware(LogMiddleware3)
    @Get('/users')
    getTest(){
        return {test:"123"}
    }

    @ApiDocs({
        resultType: UserValidator,
        summary: "custom summary",
        description: "this is my description",
        tags: ["user"]
    })
    @Get('/test')
    async getUsers(
      @Req() req: Request,
      @Res() res: Response,
      @QueryParam('test', [UpperCasePipe]) query: any,
      @Header('host', [UpperCasePipe]) headers: string,
      @QueryParam('err') err: string,
    ) {
        if (err){
            throw new NotImplementedError("idk", ["test"])
        }
        return {test: ""}
    }

    @ApiDocs({resultType: UserValidator})
    @Get('/users/:id')
    getUsersByid(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParam('test' ) query: any,
        @Header('host' ) headers,
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
      @QueryParam('test' ) query: any,
      @Header('host' ) headers,
      @Param('id' ) id: string,
    ) {
        console.log('id', id);
        res.send({ usnername: id });
    }
    
    @Endpoint({ method: 'post', route: '/users' })
    getUsers2(@BodyParam('username') body: UserValidator) {
       return body
    }
}
