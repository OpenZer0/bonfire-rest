import express from 'express';

export interface IResponseHandler {
    handle(result, res: express.Response): void;
}

export class ResponseHandler {
    handle(result, res: express.Response) {
        if (result) {
            switch (typeof result) {
                case 'object':
                    res.json(result);
                    break;
                case 'number' || 'string': {
                    res.send(result);
                }
            }
        }
    }
}
