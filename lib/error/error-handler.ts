import express from 'express';
import { StatusCodes } from './http/status-map';
export interface IErrorHandler {
    handle(error: any, req: express.Request, res: express.Response): void;
}

export class ErrorHandler implements IErrorHandler {

    handle(err: any, req: express.Request, res: express.Response) {
        const errStatus = err?.statusCode || err?.status || 500;
        const errMsg = err.message || 'Something went wrong';

        // Metrics.setResponseStat(req.path, errStatus);
        res.status(errStatus).json({
            status: errStatus,
            message: errMsg,
            statusMessage: err?.statusMessage || StatusCodes[errStatus],
            details: err.details || {},
            stack: process.env.NODE_ENV === 'development' ? err.stack : {},
        });
    }
}
