import { OperationObject } from 'openapi3-ts';
import { Type } from 'type-chef-di';
import { Constants } from '../../Constants';

export interface IApiDocsMeta {
    [fn: string]: IApiDocsOption & { fn: string };
}

export interface IApiDocsOption extends Partial<OperationObject> {
    resultType?: Type;
}

export function ApiDocs(options: IApiDocsOption) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        const metadata: IApiDocsMeta = Reflect.getMetadata(Constants.API_DOCS_KEY, target.constructor) || {};
        metadata[propertyKey] = { ...options, fn: propertyKey, resultType: options.resultType };

        Reflect.defineMetadata(Constants.API_DOCS_KEY, metadata, target.constructor);
    };
}
