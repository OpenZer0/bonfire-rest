import { Type } from 'type-chef-di';
import { IMiddleware } from '../../middleware/middleware.interface';
import { addMiddlewareMeta } from './middleware.decorator';

export function AfterMiddleware(...middlewares: Type<IMiddleware>[] | IMiddleware[]) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        addMiddlewareMeta(target, propertyKey, { beforeMiddlewares: [], afterMiddlewares: middlewares });
    };
}
