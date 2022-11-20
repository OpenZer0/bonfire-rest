import { IEndpointMeta, IFunctionParamMeta } from '../server-builder';
import { IApiDocsMeta } from '../decorators/openapi/result.decorator';
import { ParameterObject, ReferenceObject, RequestBodyObject, ResponsesObject } from 'openapi3-ts';
import { Constants } from '../Constants';

export class SchemaBuilder {
    static createResponse(endpointMeta: IEndpointMeta, docsMeta: IApiDocsMeta): ResponsesObject {
        const docsResponseType = docsMeta
            ? docsMeta[endpointMeta.fn]?.resultType
            : endpointMeta?.fnReturn?.name == 'Promise'
            ? undefined
            : endpointMeta?.fnReturn;

        return {
            ['200']: docsResponseType
                ? {
                      description: 'get test',
                      content: {
                          'application/json': {
                              schema: {
                                  $ref: `#/components/schemas/${docsResponseType?.name}`,
                              },
                          },
                      },
                  }
                : {},
        };
    }

    static createBody(docsMeta: IApiDocsMeta, params: IFunctionParamMeta[]): ReferenceObject | RequestBodyObject {
        const body = params.find((param) => param.id == Constants.BODY);
        return {
            content: body?.paramType
                ? {
                      'application/json': {
                          schema: { $ref: `#/components/schemas/${body?.paramType?.name}` },
                      },
                  }
                : {},
        };
    }

    static createParameters(
        endpointMeta: IEndpointMeta,
        docsMeta: IApiDocsMeta,
    ): (ReferenceObject | ParameterObject)[] {
        const pathParams =
            endpointMeta.route
                .split('/')
                .filter((r) => r[0] == ':')
                .map((path) => path.slice(1)) || [];
        return pathParams.map((paramName) => {
            return { name: paramName, in: 'path' };
        });
    }
}
