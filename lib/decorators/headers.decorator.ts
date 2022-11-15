import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';
import { Type } from 'type-chef-di';
import { IPipe } from '../services/pipe/pipe.interface';

export interface IHeaderOptions {
    key: string;
}

export function Headers(options?: IHeaderOptions, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.HEADERS, target, key, parameterIndex, options, pipes);
    };
}
