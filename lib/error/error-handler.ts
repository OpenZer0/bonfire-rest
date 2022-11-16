import express from 'express';
export interface IErrorHandler {
    handle(error: any, res: express.Response): void;
}

export class ErrorHandler implements IErrorHandler {
    handle(err: any, res: express.Response) {
        const errStatus = err.statusCode || 500;
        const errMsg = err.message || 'Something went wrong';
        res.status(errStatus).json({
            status: errStatus,
            message: errMsg,
            details: err.details || {},
            stack: process.env.NODE_ENV === 'development' ? err.stack : {},
        });
    }
}
