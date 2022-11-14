import 'reflect-metadata';
import { saveExpressMeta } from '../services/decorator.helper';
import { Constants } from '../Constants';

export function Res(options?: any) {
    return (target: any, key: string | symbol, parameterIndex: number) => {
        saveExpressMeta(Constants.RESPONSE, target, key, parameterIndex, options);
    };
}
