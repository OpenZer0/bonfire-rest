import express from 'express';
import { IBodyOptions } from './decorators/Body.decorator';
import { Constants } from './Constants';
import { IHeaderOptions } from './decorators/Headers.decorator';
import { IQueryOptions } from './decorators/Query.decorator';

export interface IExpressMap {
    [key: string]: (req: express.Request, res: express.Response, customOptions: any) => any;
}

export const expressMap: IExpressMap = {
    [Constants.BODY]: (req: express.Request, res: express.Response, customOptions: IBodyOptions) => {
        return req.body;
    },
    [Constants.REQUEST]: (req: express.Request, res: express.Response) => {
        return req;
    },
    [Constants.RESPONSE]: (req: express.Request, res: express.Response) => {
        return res;
    },
    [Constants.QUERY]: (req: express.Request, res: express.Response, customOptions: IQueryOptions) => {
        return customOptions.key ? req.query[customOptions.key] : req.query;
    },
    [Constants.HEADERS]: (req: express.Request, res: express.Response, customOptions: IHeaderOptions) => {
        return customOptions.key ? req.headers[customOptions.key] : req.headers;
    },
};
