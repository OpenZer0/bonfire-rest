import { IExpressMap } from '../decorator-map';
import { IPipe } from './pipe/pipe.interface';
import { Type } from 'type-chef-di';

export function saveExpressMeta<O = any>(
    id: string,
    target,
    key,
    parameterIndex,
    options: O,
    pipes: Type<IPipe>[] = [],
) {
    const fnParamTypes = Reflect.getMetadata('design:paramtypes', target, key) || [];
    const metadata: { index: number; id: keyof IExpressMap; options: O; pipes: Type<IPipe>[]; paramType: any }[] =
        Reflect.getMetadata(key, target.constructor) || [];

    // @ts-ignore
    metadata[parameterIndex] = {
        index: parameterIndex,
        options,
        id,
        pipes: pipes,
        paramType: fnParamTypes[parameterIndex],
    };
    Reflect.defineMetadata(key, metadata, target.constructor);
}
