import e from 'express';

export interface IMiddleware {
    handle(req: e.Request, res: e.Response, next: Function);
}
