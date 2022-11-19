import 'reflect-metadata';
import { Constants } from '../Constants';

export interface IEndpointOptions {
    method: 'get' | 'post' | 'delete' | 'patch' | 'put';
    route: string;
}

export function Endpoint(options: IEndpointOptions) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        const returnType = Reflect.getMetadata('design:returntype', target, propertyKey);
        const metadata: any[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, target.constructor) || [];
        // @ts-ignore
        metadata.push({ ...options, fn: propertyKey, fnReturn: returnType });

        Reflect.defineMetadata(Constants.ENDPOINT_KEY, metadata, target.constructor);
    };
}
