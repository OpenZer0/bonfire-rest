import { Type } from 'type-chef-di';
import { IMiddleware } from '../../middleware/middleware.interface';
import { addMiddlewareMeta } from './middleware.decorator';

export function BeforeMiddleware(...middlewares: Type<IMiddleware>[]) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        addMiddlewareMeta(target, propertyKey, { beforeMiddlewares: middlewares, afterMiddlewares: [] });
    };
}
