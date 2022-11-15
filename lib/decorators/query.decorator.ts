import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';
import { IPipe } from '../services/pipe/pipe.interface';
import { Type } from 'type-chef-di';

export interface IQueryOptions {
    key?: string;
}

export function Query(propKey?: string, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta<IQueryOptions>(Constants.QUERY, target, key, parameterIndex, { key: propKey }, pipes);
    };
}
