import { Type } from 'type-chef-di';
import { IMiddleware } from '../../middleware/middleware.interface';
import { Constants } from '../../Constants';

export interface IMiddlewareMeta {
    beforeMiddlewares: Type<IMiddleware>[];
    afterMiddlewares: Type<IMiddleware>[];
}

export function Middleware(options: IMiddlewareMeta) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        addMiddlewareMeta(target, propertyKey, options);
    };
}

export const addMiddlewareMeta = (target: object, propertyKey: string, options) => {
    const metadata: IMiddlewareMeta = Reflect.getMetadata(Constants.ENDPOINT_MIDDLEWARES, target.constructor) || {};
    // @ts-ignore
    metadata[propertyKey] = {
        beforeMiddlewares: (metadata[propertyKey]?.beforeMiddlewares || []).concat(options.beforeMiddlewares),
        afterMiddlewares: (metadata[propertyKey]?.afterMiddlewares || []).concat(options.afterMiddlewares),
    };
    Reflect.defineMetadata(Constants.ENDPOINT_MIDDLEWARES, metadata, target.constructor);
};
