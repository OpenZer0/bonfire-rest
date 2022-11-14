import { Container } from 'type-chef-di';
import { Constants } from './Constants';
import express from 'express';
import { expressMap } from './decoratorMap';
import * as bodyParser from 'body-parser';

export class ServerBuilder {
    static container = new Container({ enableAutoCreate: true });

    static async build(options: { controllers: any[]; express: express.Express }) {
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
                throw new Error('cant resolve param');
            }
            return expressMap[param.id](req, res, param.options);
        });
    }

    static async setupController(server: express.Express, controllerType: any) {
        const meta: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
        const controller = await this.container.resolveByType(controllerType);
        for (const endpoint of meta) {
            console.log(`add route: ${endpoint.method} ${endpoint.route}`);
            server[endpoint.method](endpoint.route, (req, res) => {
                console.log(
                    'resolved args',
                    ServerBuilder.buildEndpointArgs(req, res, controllerType, endpoint).map((t) => t?.constructor),
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
