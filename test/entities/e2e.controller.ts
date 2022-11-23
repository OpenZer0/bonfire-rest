import { Response } from 'express';
import { Res } from '../../lib/decorators/response.decorator';
import { Body, BodyParam } from "../../lib/decorators/body.decorator";
import { Header, Injectable, Params } from "../../lib/index";
import { Get } from '../../lib/decorators/method/get.decorator';
import { Post } from '../../lib/decorators/method/post.decorator';
import { Param } from '../../lib/decorators/param.decorator';
import {UpperCasePipe} from "../../example/services/upper.pipe";

@Injectable()
export class E2eController {
    @Get('/get')
    test(@Res() res: Response) {
        res.json({ message: 'good' });
    }

    @Post('/post')
    bodyTest(@Res() res: Response, @Body() body: any, @BodyParam("paramTest") bodyParam: any) {
        res.json({body, bodyParam});
    }

    @Get('/header')
    test2(@Res() res: Response, @Header('custom-header') header: string) {
        res.json({ header: header });
    }

    @Post('/param/:id/:id2')
    paramTest(@Res() res: Response, @Param( 'id' ) id: string, @Params() params: any) {
        res.json({ param: id, params });
    }
    @Post('/pipe/:id')
    test4(@Res() res: Response, @Param( 'id' , [UpperCasePipe]) id: string) {
        res.json({ param: id });
    }
}
