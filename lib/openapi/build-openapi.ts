import { OpenApiBuilder } from 'openapi3-ts';
import { Type } from 'type-chef-di';
import { IEndpointMeta, IFunctionParamMeta } from '../server-builder';
import { Constants } from '../Constants';
import e from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as path from 'path';
import { BonfireServer, IServerContext } from '../bonfire-server';

export interface IOpenApiOptions {
    title: string;
    swaggerUi: string;
    apiDocs: string;
}

export class BuildOpenApi {
    static async addOpenapi(app: e.Express, options: IOpenApiOptions, controllers: Type[]) {
        const schemas = validationMetadatasToSchemas();
        const doc = new OpenApiBuilder().addTitle(options.title);
        for (const [key, value] of Object.entries(schemas)) {
            doc.addSchema(key, value);
        }
        for (const controllerType of controllers) {
            const metas: IEndpointMeta[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, controllerType);
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
                                responses: {},
                            },
                        });
                        break;
                    case 'post':
                        const params: IFunctionParamMeta[] = Reflect.getMetadata(endpoint.fn, controllerType) || [];
                        const body = params.find((param) => param.id == Constants.BODY);
                        console.warn(body?.paramType?.name);
                        doc.addPath(route, {
                            post: {
                                requestBody: {
                                    content: body?.paramType
                                        ? {
                                              'application/json': {
                                                  schema: { $ref: `#/components/schemas/${body?.paramType?.name}` },
                                              },
                                          }
                                        : {},
                                },
                                responses: {
                                    ['200']: endpoint.fnReturn
                                        ? {
                                              description: 'post test',
                                              content: {
                                                  'application/json': {
                                                      schema: {
                                                          $ref: `#/components/schemas/${endpoint.fnReturn?.name}`,
                                                      },
                                                  },
                                              },
                                          }
                                        : {},
                                },
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
