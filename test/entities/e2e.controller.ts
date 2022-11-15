import { Response } from 'express';
import { Res } from '../../src/lib/decorators/response.decorator';
import { Body } from '../../src/lib/decorators/body.decorator';
import { Injectable } from '../../src/lib/index';
import { Get } from '../../src/lib/decorators/method/get.decorator';
import { Post } from '../../src/lib/decorators/method/post.decorator';
import { Headers } from '../../src/lib/decorators/headers.decorator';
import { Param } from '../../src/lib/decorators/param.decorator';
import {UpperCasePipe} from "../../src/example/services/upper.pipe";

@Injectable()
export class E2eController {
    @Get('/get')
    test(@Res() res: Response) {
        res.json({ message: 'good' });
    }

    @Post('/post')
    test1(@Res() res: Response, @Body() body: any) {
        res.json(body);
    }

    @Get('/header')
    test2(@Res() res: Response, @Headers({ key: 'custom-header' }) header: string) {
        res.json({ header: header });
    }

    @Post('/param/:id')
    test3(@Res() res: Response, @Param({ key: 'id' }) id: string) {
        res.json({ param: id });
    }
    @Post('/pipe/:id')
    test4(@Res() res: Response, @Param({ key: 'id' }, [UpperCasePipe]) id: string) {
        res.json({ param: id });
    }
}
