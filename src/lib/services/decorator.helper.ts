import { IExpressMap } from '../decorator-map';

export function saveExpressMeta(id: string, target, key, parameterIndex, options) {
    const metadata: { index: number; id: keyof IExpressMap }[] = Reflect.getMetadata(key, target.constructor) || [];
    // @ts-ignore
    metadata[parameterIndex] = { options, index: parameterIndex, id };

    Reflect.defineMetadata(key, metadata, target.constructor);
}
