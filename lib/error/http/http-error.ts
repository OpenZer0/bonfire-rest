import { StatusCodes } from './status-map';

export interface IHttpError {
    readonly status: number;
    readonly statusMessage: string;
    message: string;
    readonly details?: any | any[];
}

export class HttpError extends Error implements IHttpError {
    statusMessage: string;
    constructor(readonly status: number, message: string, readonly details?: string) {
        super(message);
        this.statusMessage = this.getStatusCodeMessage(status);
    }

    private getStatusCodeMessage(status: number) {
        return StatusCodes[status] || 'unknown error';
    }
}
