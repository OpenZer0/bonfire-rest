import 'reflect-metadata';
import { Constants } from '../Constants';
import { saveExpressMeta } from '../services/decorator.helper';

export interface IParamOptions {
    key: string;
}

export function Param(options?: IParamOptions) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.ROUTE_PARAM, target, key, parameterIndex, options);
    };
}
