import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';

export interface IQueryOptions {
    key: string;
}

export function Query(options?: IQueryOptions) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.QUERY, target, key, parameterIndex, options);
    };
}
