export class CustomValidationError extends Error {
    constructor(private readonly errors: string[]) {
        super(errors.map((error) => error).join(', '));
    }
}
