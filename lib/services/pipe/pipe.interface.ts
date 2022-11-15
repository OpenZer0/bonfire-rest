import { IFunctionParamMeta } from '../../server-builder';

export interface IPipe<T = any> {
    pipe(value: T, paramOptions?: IFunctionParamMeta): any;
}
