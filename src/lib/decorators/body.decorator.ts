import 'reflect-metadata';
import { Constants } from '../Constants';
import { saveExpressMeta } from '../services/decorator.helper';

export interface IBodyOptions {
    prop: string;
}

export function Body(options?: IBodyOptions) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.BODY, target, key, parameterIndex, options);
    };
}
