import 'reflect-metadata';
import { Constants } from '../Constants';

export function EndpointDecorator(options: { method: 'get' | 'post'; route: string }) {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        const metadata: any[] = Reflect.getMetadata(Constants.ENDPOINT_KEY, target.constructor) || [];
        // @ts-ignore
        metadata.push({ ...options, fn: propertyKey });

        Reflect.defineMetadata(Constants.ENDPOINT_KEY, metadata, target.constructor);
    };
}
