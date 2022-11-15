import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';
import { IPipe } from '../services/pipe/pipe.interface';
import { Type } from 'type-chef-di';

export interface IQueryOptions {
    key: string;
}

export function Query(options?: IQueryOptions, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.QUERY, target, key, parameterIndex, options, pipes);
    };
}
