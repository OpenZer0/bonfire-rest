import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
    constructor(message: string, details?: any) {
        super(400, message, details);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, details?: any) {
        super(401, message, details);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string, details?: any) {
        super(403, message, details);
    }
}

export class InternalServerError extends HttpError {
    constructor(message: string, details?: any) {
        super(500, message, details);
    }
}

export class NotImplementedError extends HttpError {
    constructor(message: string, details?: any) {
        super(501, message, details);
    }
}
