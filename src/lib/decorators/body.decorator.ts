import 'reflect-metadata';
import { Constants } from '../Constants';
import { saveExpressMeta } from '../services/decorator.helper';
import { Type } from 'type-chef-di';
import { IPipe } from '../services/pipe/pipe.interface';

export interface IBodyOptions {
    prop: string;
}

export function Body(options?: IBodyOptions, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.BODY, target, key, parameterIndex, options, pipes);
    };
}
