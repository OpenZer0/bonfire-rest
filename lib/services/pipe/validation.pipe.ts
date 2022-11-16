import { IPipe } from './pipe.interface';
import { IFunctionParamMeta } from '../../server-builder';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Injectable } from 'type-chef-di';
import { ValidationError } from '../../error/validation.error';

@Injectable()
export class ValidationPipe implements IPipe {
    async pipe(value: any, meta: IFunctionParamMeta): Promise<any> {
        if (typeof value != 'object') {
            return value;
        }
        const errors = await validate(plainToInstance(meta.paramType, value || {}));
        if (errors.length > 0) {
            throw new ValidationError('Validation error', errors);
        }
        return value;
    }
}
