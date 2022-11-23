import 'reflect-metadata';
import { Constants } from '../Constants';
import { saveExpressMeta } from '../services/decorator.helper';
import { Type } from 'type-chef-di';
import { IPipe } from '../services/pipe/pipe.interface';

export interface IParamOptions {
    key?: string;
}

export function Param(propKey?: string, pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta<IParamOptions>(Constants.ROUTE_PARAM, target, key, parameterIndex, { key: propKey }, pipes);
    };
}

export function Params(pipes: Type<IPipe>[] = []) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta<IParamOptions>(Constants.ROUTE_PARAM, target, key, parameterIndex, { key: undefined }, pipes);
    };
}
