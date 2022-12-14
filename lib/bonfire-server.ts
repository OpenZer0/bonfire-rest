import { Container, Type } from 'type-chef-di';
import { ILogger } from './common/logger/logger.interface';
import { IPipe } from './services/pipe/pipe.interface';
import express from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from './common/logger/logger';
import { IErrorHandler } from './error/error-handler';
import { Constants } from './Constants';
import { IEndpointMeta, IFunctionParamMeta } from './server-builder';
import { IResponseHandler } from './response.handler';
import { expressMap } from './decorator-map';
import { Utils } from './common/Utils';
import * as path from 'path';
import { IMiddleware } from './middleware/middleware.interface';
import { OpenapiBuilder, IOpenApiOptions } from './openapi/openapi-builder';
import { IMiddlewareMeta } from './decorators/middleware/middleware.decorator';

export interface IServerContext {
    controllers: any[];
    server?: express.Express;
    logger?: ILogger;
    globalPipes?: Type<IPipe>[];
    globalPrefix?: string;
    globalMiddlewares?: Type<IMiddleware>[];
    auth?: {
        isBearer: boolean;
        secret: string;
    };
    openapi?: IOpenApiOptions;
    assetFolders?: { root: string; path: string }[];
}

export class BonfireServer {
    static container = new Container({ enableAutoCreate: true });
    private logger: ILogger;

    constructor(
        private ctx: IServerContext,
        private readonly errorHandler: IErrorHandler,
        private readonly responseHandler: IResponseHandler,
    ) {}

    private async prepare() {
        this.ctx = {
            ...{
                controllers: [],
                server: express(),
                logger: new Logger(),
                globalPipes: [],
                globalPrefix: '/',
                globalMiddlewares: [],
                openapi: {
                    swaggerUi: 'swagger-ui',
                    apiDocs: 'api-docs',
                    spec: { info: { title: 'bonfire-app', version: '3' }, openapi: '3.0.0' },
                },
                assetFolders: [],
            },
            ...this.ctx,
        };
        this.ctx.globalPrefix = `/${this.ctx.globalPrefix}`;
        this.logger = this.ctx.logger || new Logger(BonfireServer.name);
        this.ctx.server.use(bodyParser.json());

        BonfireServer.container.registerTypes(this.ctx.controllers);
        BonfireServer.container.registerTypes(this.ctx.globalMiddlewares);
        BonfireServer.container.register('ctx', this.ctx);

        for (const asset of this.ctx.assetFolders) {
            const root = path.join('/', asset.root);
            this.logger.log(`Asset folder serve: ${root} --> folder: ${asset.path}`);
            this.ctx.server.use(root, express.static(asset.path));
        }
        for (const middleware of this.ctx.globalMiddlewares) {
            this.logger.log('Use middleware: ', middleware.name);
            const resolvedMiddleware = await BonfireServer.container.resolveByType(middleware);
            this.ctx.server.use(async (req, res, next) => await resolvedMiddleware.handle(req, res, next));
        }

        if (this.ctx.globalPipes.length > 0) {
            BonfireServer.container.registerTypes(this.ctx.globalPipes);
        }
    }

    async build() {
        await this.prepare();
        const doc = await OpenapiBuilder.addOpenapi(this.ctx.server, this.ctx.openapi, this.ctx.controllers);
        for (const controller of this.ctx.controllers) {
            await this.setupController(controller);
        }
        return this;
    }

    getExpress(): express.Express {
        return this.ctx.server;
    }

    private async setupController(controllerType: any) {
        const meta: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
        const controller = await BonfireServer.container.resolveByType(controllerType);

        for (const endpoint of meta) {
            const middlewareMeta: Record<string, IMiddlewareMeta> =
                Reflect.getMetadata(Constants.ENDPOINT_MIDDLEWARES, controllerType) || {};
            await this.createEndpoint(endpoint, controllerType, controller, middlewareMeta[endpoint.fn]);
        }
    }

    private async createEndpoint(
        endpoint: IEndpointMeta,
        controllerType: Type,
        controller: any,
        middlewareMeta?: IMiddlewareMeta,
    ) {
        const controllerMeta: { prefix?: string } = Reflect.getMetadata(Constants.CONTROLLER_KEY, controllerType);
        const route = path.join(this.ctx.globalPrefix, `/${controllerMeta?.prefix || '/'}`, endpoint.route);
        this.logger.log(`Add route: ${endpoint.method.toUpperCase()} ${route}`);

        const getBeforeMiddlewares = () => {
            return Promise.all(
                (middlewareMeta?.beforeMiddlewares || []).map(async (middleware) => {
                    let resolvedMiddleware: IMiddleware = middleware;
                    if (typeof middleware == 'function') {
                        resolvedMiddleware = await BonfireServer.container.resolveByType(middleware);
                    }
                    return async (req, res, next) => {
                        try {
                            await resolvedMiddleware.handle(req, res, next);
                        } catch (e) {
                            this.errorHandler.handle(e, req, res);
                        }
                    };
                }),
            );
        };

        const getAfterMiddlewares = () => {
            return Promise.all(
                (middlewareMeta?.afterMiddlewares || []).map(async (middleware) => {
                    let resolvedMiddleware: IMiddleware = middleware;
                    if (typeof middleware == 'function') {
                        resolvedMiddleware = await BonfireServer.container.resolveByType(middleware);
                    }
                    return async (req, res, next) => {
                        try {
                            await resolvedMiddleware.handle(req, res, next);
                        } catch (e) {
                            this.errorHandler.handle(e, req, res);
                        }
                    };
                }),
            );
        };
        await this.ctx.server[endpoint.method](
            route,
            await getBeforeMiddlewares(),
            async (req: express.Request, res: express.Response, next: Function) => {
                try {
                    const result = await this.handleRequest(req, res, controller, controllerType, endpoint);
                    this.responseHandler.handle(result, res);
                } catch (e) {
                    this.errorHandler.handle(e, req, res);
                }
                next();
            },
            ...(await getAfterMiddlewares()),
        );
    }

    private async handleRequest(
        req: express.Request,
        res: express.Response,
        controller: any,
        controllerType: Type,
        endpoint: IEndpointMeta,
    ) {
        this.logger.debug(
            'Resolved args',
            (await this.buildEndpointArgs(req, res, controllerType, endpoint)).map((t) => t?.constructor),
        );
        this.logger.log(`Call: ${endpoint.method.toUpperCase()} ${endpoint.route} in ${controller.constructor.name}`);
        return await controller[endpoint.fn](...(await this.buildEndpointArgs(req, res, controllerType, endpoint)));
    }

    private async buildEndpointArgs(req, res, controllerClass: any, endpoint: IEndpointMeta): Promise<any[]> {
        const params: IFunctionParamMeta[] = Reflect.getMetadata(endpoint.fn, controllerClass) || [];

        const args = [];
        for (const param of params) {
            if (!param) {
                throw new Error("Can't resolve param");
            }
            this.logger.debug(`Try to resolve: @${param.id} decorator`);
            let result = expressMap[param.id](req, res, param.options);
            if (param.id != Constants.REQUEST && param.id != Constants.RESPONSE) {
                result = await this.runPipes(result, this.ctx.globalPipes.concat(param.pipes), param);
            }
            if (!Utils.isCyclic(result)) {
                this.logger.debug(`@${param.id} = ${JSON.stringify(result, null, 2)}`);
            }
            args.push(result);
        }
        return args;
    }

    private async runPipes(value, pipes: Type<IPipe>[] = [], paramMeta: IFunctionParamMeta) {
        if (pipes.length == 0) {
            return value;
        }
        this.logger.debug(`Use pipes: ${pipes.map((p) => p.name).join(', ')}`);
        let pipeResultVal = value;
        for (const pipe of pipes) {
            const resolvedPipe = await BonfireServer.container.resolveByType(pipe);
            pipeResultVal = await resolvedPipe.pipe(pipeResultVal, paramMeta);
        }
        return pipeResultVal;
    }
}
