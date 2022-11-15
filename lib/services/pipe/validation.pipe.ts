import { IPipe } from './pipe.interface';
import { IFunctionParamMeta } from '../../server-builder';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
export class ValidationError extends Error {
    constructor(msg: string, private readonly details: any) {
        super(msg);
    }
}

export class ValidationPipe implements IPipe {
    async pipe(value: any, meta: IFunctionParamMeta): Promise<any> {
        const errors = await validate(plainToInstance(meta.paramType, value));
        if (errors.length > 0) {
            throw new ValidationError('validation error', errors);
        }
        return value;
    }
}
