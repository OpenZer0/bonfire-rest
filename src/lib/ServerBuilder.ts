import { Container } from 'type-chef-di';
import { Constants } from './Constants';
import express from 'express';
import { expressMap } from './decoratorMap';
import * as bodyParser from 'body-parser';
import { Logger } from './common/logger/logger';
import { Utils } from './common/Utils';

export class ServerBuilder {
    private static readonly logger = new Logger(ServerBuilder.name);

    static container = new Container({ enableAutoCreate: true });

    static async build(options: { controllers: any[]; express?: express.Express }): Promise<express.Express> {
        options.express = options.express ? express() : options.express;
        options.express.use(bodyParser.json());
        this.container.registerTypes(options.controllers);
        for (const controller of options.controllers) {
            await this.setupController(options.express, controller);
        }
        return options.express;
    }

    static buildEndpointArgs(req, res, controllerClass: any, endpoint: IEndpointMeta): any[] {
        const params: { id: string; options: any }[] = Reflect.getMetadata(endpoint.fn, controllerClass);
        return params.map((param) => {
            if (!param) {
                throw new Error("Can't resolve param");
            }

            this.logger.debug(`Try to resolve: @${param.id} decorator`);
            const result = expressMap[param.id](req, res, param.options);
            if (!Utils.isCyclic(result)) {
                this.logger.debug(`@${param.id} = ${JSON.stringify(result, null, 2)}`);
            }
            return result;
        });
    }

    static async setupController(server: express.Express, controllerType: any) {
        const meta: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
        const controller = await this.container.resolveByType(controllerType);
        for (const endpoint of meta) {
            this.logger.log(`Add route: ${endpoint.method} ${endpoint.route}`);
            server[endpoint.method](endpoint.route, (req, res) => {
                this.logger.debug(
                    'Resolved args',
                    ServerBuilder.buildEndpointArgs(req, res, controllerType, endpoint).map((t) => t?.constructor),
                );
                this.logger.log(
                    `Call: ${endpoint.method.toUpperCase()} ${endpoint.route} in ${controller.constructor.name}`,
                );
                return controller[endpoint.fn](...ServerBuilder.buildEndpointArgs(req, res, controllerType, endpoint));
            });
        }
    }
}

export interface IEndpointMeta {
    method: 'get' | 'post' | 'patch' | 'delete';
    route: string;
    fn: string;
}
