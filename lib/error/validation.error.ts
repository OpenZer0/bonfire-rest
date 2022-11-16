import { exceptionFactoryErrorHandle } from './validation-error.factory';

export class ValidationError extends Error {
    constructor(private readonly msg: string, private details: any) {
        details = exceptionFactoryErrorHandle(details);
        super(msg);
    }
}
