import { iterate } from 'iterare';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from './custom-validation.error';

export function exceptionFactoryErrorHandle(validationErrors: ValidationError[] = []) {
    if (validationErrors.length > 0) {
        const errors = flattenValidationErrors(validationErrors);
        return new CustomValidationError(errors);
    }
}

export function flattenValidationErrors(errors: ValidationError[]): string[] {
    return iterate(errors)
        .map((error) => mapChildrenToValidationErrors(error))
        .flatten()
        .filter((item) => !!item.constraints)
        .map((item) => Object.values(item.constraints))
        .flatten()
        .toArray();
}

export function mapChildrenToValidationErrors(error: ValidationError, parentPath?: string): ValidationError[] {
    if (!(error.children && error.children.length)) {
        return [error];
    }
    const validationErrors = [];
    parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
    for (const item of error.children) {
        if (item.children && item.children.length) {
            validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
        }
        validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
    }
    return validationErrors;
}

export function prependConstraintsWithParentProp(parentPath: string, error: ValidationError): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
        constraints[key] = `${parentPath}.${error.constraints[key]}`;
    }
    return {
        ...error,
        constraints,
    };
}
