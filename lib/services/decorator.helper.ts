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
    const metadata: { index: number; id: keyof IExpressMap }[] = Reflect.getMetadata(key, target.constructor) || [];
    // console.log(pipes.map((p) => p.constructor))
    // @ts-ignore
    metadata[parameterIndex] = { options, index: parameterIndex, id, pipes: pipes };

    Reflect.defineMetadata(key, metadata, target.constructor);
}
