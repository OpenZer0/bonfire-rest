import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';

export interface IHeaderOptions {
    key: string;
}

export function Headers(options?: IHeaderOptions) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.HEADERS, target, key, parameterIndex, options);
    };
}
