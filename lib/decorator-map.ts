import express from 'express';
import { IBodyOptions } from './decorators/body.decorator';
import { Constants } from './Constants';
import { IHeaderOptions } from './decorators/headers.decorator';
import { IQueryOptions } from './decorators/query.decorator';
import { IParamOptions } from './decorators/param.decorator';

export interface IExpressMap {
    [key: string]: (req: express.Request, res: express.Response, customOptions: any) => any;
}

export const expressMap: IExpressMap = {
    [Constants.BODY]: (req: express.Request, res: express.Response, customOptions: IBodyOptions) => {
        return customOptions?.prop ? req?.body[customOptions?.prop] : req?.body;
    },
    [Constants.REQUEST]: (req: express.Request, res: express.Response) => {
        return req;
    },
    [Constants.RESPONSE]: (req: express.Request, res: express.Response) => {
        return res;
    },
    [Constants.QUERY]: (req: express.Request, res: express.Response, customOptions: IQueryOptions) => {
        return customOptions?.key ? req.query[customOptions.key] : req.query;
    },
    [Constants.HEADERS]: (req: express.Request, res: express.Response, customOptions: IHeaderOptions) => {
        return customOptions?.key ? req.headers[customOptions.key] : req.headers;
    },
    [Constants.ROUTE_PARAM]: (req: express.Request, res: express.Response, customOptions: IParamOptions) => {
        return customOptions?.key ? req.params[customOptions.key] : req.params;
    },
};
