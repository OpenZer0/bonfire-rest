import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';

export function Req(options?: any) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.REQUEST, target, key, parameterIndex, options);
    };
}
