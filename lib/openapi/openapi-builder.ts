import { OpenApiBuilder } from 'openapi3-ts';
import { Type } from 'type-chef-di';
import { IEndpointMeta, IFunctionParamMeta } from '../server-builder';
import { Constants } from '../Constants';
import e from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as path from 'path';
import { BonfireServer, IServerContext } from '../bonfire-server';
import { IApiDocsMeta } from '../decorators/openapi/result.decorator';
import { SchemaBuilder } from './schema-builder';

export interface IOpenApiOptions {
    title: string;
    swaggerUi: string;
    apiDocs: string;
}

export class OpenapiBuilder {
    static async addOpenapi(app: e.Express, options: IOpenApiOptions, controllers: Type[]) {
        const schemas = validationMetadatasToSchemas();
        const doc = new OpenApiBuilder().addTitle(options.title);
        for (const [key, value] of Object.entries(schemas)) {
            doc.addSchema(key, value);
        }
        for (const controllerType of controllers) {
            const metas: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
            const docsMeta: IApiDocsMeta = Reflect.getMetadata(Constants.API_DOCS_KEY, controllerType);

            for (const endpoint of metas) {
                const ctx: IServerContext = await BonfireServer.container.resolve('ctx');
                const controllerMeta: { prefix?: string } = Reflect.getMetadata(
                    Constants.CONTROLLER_KEY,
                    controllerType,
                );
                const route = path.join(ctx.globalPrefix, `/${controllerMeta?.prefix || '/'}`, endpoint.route);
                switch (endpoint.method) {
                    case 'get':
                        doc.addPath(route, {
                            get: {
                                parameters: SchemaBuilder.createParameters(endpoint, docsMeta),
                                responses: SchemaBuilder.createResponse(endpoint, docsMeta),
                            },
                        });
                        break;
                    case 'post':
                        const params: IFunctionParamMeta[] = Reflect.getMetadata(endpoint.fn, controllerType) || [];
                        doc.addPath(route, {
                            post: {
                                parameters: SchemaBuilder.createParameters(endpoint, docsMeta),
                                requestBody: SchemaBuilder.createBody(docsMeta, params),
                                responses: SchemaBuilder.createResponse(endpoint, docsMeta),
                            },
                        });
                        break;
                }
            }
        }

        app.get(path.join('/', options.apiDocs), (req, res) => {
            res.json(doc.rootDoc);
        });
        app.use(path.join('/', options.swaggerUi), swaggerUi.serve, swaggerUi.setup(doc.rootDoc));

        return doc;
    }
}
