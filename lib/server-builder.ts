import { Type } from 'type-chef-di';
import express, { Express } from 'express';
import { IExpressMap } from './decorator-map';
import { IPipe } from './services/pipe/pipe.interface';
import { BonfireServer, IServerContext } from './bonfire-server';
import { ErrorHandler } from './error/error-handler';
import { ResponseHandler } from './response.handler';
import { Logger } from './common/logger/logger';

export interface IFunctionParamMeta {
    index: number;
    id: keyof IExpressMap;
    options: any;
    pipes: Type<IPipe>[];
    paramType: any;
}
export class ServerBuilder {
    static async build(options: IServerContext): Promise<express.Express> {
        const server = new BonfireServer(
            { logger: new Logger(BonfireServer.name), ...options },
            new ErrorHandler(),
            new ResponseHandler(),
        );
        return (await server.build()).getExpress();
    }
}

export interface IEndpointMeta {
    method: 'get' | 'post' | 'patch' | 'delete';
    route: string;
    fn: string;
    fnReturn?: any;
}
