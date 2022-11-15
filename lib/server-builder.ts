import { Container, Type } from 'type-chef-di';
import { Constants } from './Constants';
import express, { Express } from 'express';
import { expressMap, IExpressMap } from './decorator-map';
import * as bodyParser from 'body-parser';
import { Utils } from './common/Utils';
import { IPipe } from './services/pipe/pipe.interface';
import { ILogger } from './common/logger/logger.interface';
import { Logger } from './common/logger/logger';

export interface IFunctionParamMeta {
    index: number;
    id: keyof IExpressMap;
    options: any;
    pipes: Type<IPipe>[];
    paramType: any;
}
export class ServerBuilder {
    private static logger: ILogger = new Logger(ServerBuilder.name);

    static container = new Container({ enableAutoCreate: true });

    static async build(options: {
        controllers: any[];
        express?: express.Express;
        logger?: ILogger;
        globalPipes?: Type<IPipe>[];
    }): Promise<Express> {
        if (options.logger) {
            ServerBuilder.logger = options.logger;
        }

        options.express = options.express ? express() : options.express;
        options.express.use(bodyParser.json());

        this.container.registerTypes(options.controllers);
        for (const controller of options.controllers) {
            await this.setupController(options.express, controller, options.globalPipes);
        }
        return options.express;
    }

    static async buildEndpointArgs(
        req,
        res,
        controllerClass: any,
        endpoint: IEndpointMeta,
        globalPipes: Type<IPipe>[],
    ): Promise<any[]> {
        const params: { index: number; id: keyof IExpressMap; options: any; pipes: Type<IPipe>[]; paramType: any }[] =
            Reflect.getMetadata(endpoint.fn, controllerClass) || [];

        return Promise.all(
            params.map(async (param, i) => {
                if (!param) {
                    throw new Error("Can't resolve param");
                }

                this.logger.debug(`Try to resolve: @${param.id} decorator`);
                let result = expressMap[param.id](req, res, param.options);
                const pipes = (globalPipes || []).concat(param.pipes);
                if (pipes.length > 0) {
                    this.logger.debug(`Use pipes: ${pipes.map((p) => p.name).join(', ')}`);
                    let pipeResultVal = result;
                    for (const pipe of pipes) {
                        const resolvedPipe = await this.container.resolveByType(pipe);
                        pipeResultVal = await resolvedPipe.pipe(pipeResultVal, param);
                    }
                    result = pipeResultVal;
                }

                if (!Utils.isCyclic(result)) {
                    this.logger.debug(`@${param.id} = ${JSON.stringify(result, null, 2)}`);
                }
                return result;
            }),
        );
    }

    static async setupController(server: express.Express, controllerType: any, globalPipes?: Type<IPipe>[]) {
        const meta: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
        const controller = await this.container.resolveByType(controllerType);

        // register endpoint
        for (const endpoint of meta) {
            this.logger.log(`Add route: ${endpoint.method.toUpperCase()} ${endpoint.route}`);
            await server[endpoint.method](endpoint.route, async (req: express.Request, res: express.Response) => {
                try {
                    this.logger.debug(
                        'Resolved args',
                        (await ServerBuilder.buildEndpointArgs(req, res, controllerType, endpoint, globalPipes)).map(
                            (t) => t?.constructor,
                        ),
                    );
                    this.logger.log(
                        `Call: ${endpoint.method.toUpperCase()} ${endpoint.route} in ${controller.constructor.name}`,
                    );

                    const result = await controller[endpoint.fn](
                        ...(await ServerBuilder.buildEndpointArgs(req, res, controllerType, endpoint, globalPipes)),
                    );
                    if (result) {
                        switch (typeof result) {
                            case 'object':
                                res.json(result);
                                break;
                            case 'number' || 'string': {
                                res.send(result);
                            }
                        }
                    }
                } catch (e) {
                    this.handleError(e, res);
                }
            });
        }
    }

    static handleError(err: any, res: express.Response) {
        const errStatus = err.statusCode || 500;
        const errMsg = err.message || 'Something went wrong';
        res.status(errStatus).json({
            status: errStatus,
            message: errMsg,
            details: err.details || {},
            stack: process.env.NODE_ENV === 'development' ? err.stack : {},
        });
    }
}

export interface IEndpointMeta {
    method: 'get' | 'post' | 'patch' | 'delete';
    route: string;
    fn: string;
}
