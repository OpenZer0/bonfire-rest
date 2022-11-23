import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';
import { Type } from 'type-chef-di';
import { IPipe } from '../services/pipe/pipe.interface';

export interface IHeaderOptions {
    key?: string;
}

export function Headers(pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta<IHeaderOptions>(Constants.HEADERS, target, key, parameterIndex, { key: undefined }, pipes);
    };
}

export function Header(propKey: string, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta<IHeaderOptions>(Constants.HEADERS, target, key, parameterIndex, { key: propKey }, pipes);
    };
}
