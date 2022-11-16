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

export interface IServerContext {
    controllers: any[];
    server?: express.Express;
    logger?: ILogger;
    globalPipes?: Type<IPipe>[];
}

export class BonfireServer {
    static container = new Container({ enableAutoCreate: true });
    private logger: ILogger = new Logger(BonfireServer.name);

    constructor(
        private ctx: IServerContext,
        private readonly errorHandler: IErrorHandler,
        private readonly responseHandler: IResponseHandler,
    ) {
        this.prepare();
    }

    private prepare() {
        this.ctx = { ...{ controllers: [], server: express(), logger: new Logger(), globalPipes: [] }, ...this.ctx };
        this.logger = this.ctx.logger;
        this.ctx.server.use(bodyParser.json());
        BonfireServer.container.registerTypes(this.ctx.controllers);
        if (this.ctx.globalPipes.length > 0) {
            BonfireServer.container.registerTypes(this.ctx.globalPipes);
        }
    }

    async build() {
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
            await this.createEndpoint(endpoint, controllerType, controller);
        }
    }

    private async createEndpoint(endpoint: IEndpointMeta, controllerType: Type, controller: any) {
        this.logger.log(`Add route: ${endpoint.method.toUpperCase()} ${endpoint.route}`);
        await this.ctx.server[endpoint.method](endpoint.route, async (req: express.Request, res: express.Response) => {
            try {
                const result = await this.handleRequest(req, res, controller, controllerType, endpoint);
                this.responseHandler.handle(result, res);
            } catch (e) {
                this.errorHandler.handle(e, res);
            }
        });
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
