import express from 'express';
import * as jwt from 'jsonwebtoken';
import { Inject } from "type-chef-di";
import { IServerContext } from "../../lib/bonfire-server";
import e from "express";
import { IMiddleware } from "../../lib/middleware/middleware.interface";

export interface IPayload {
    roles: string[];
}

export class JwtAuthService {

    requestHandler(req: express.Request, res: express.Response, isBearer: boolean, privateKey: string = 'key') {
        const authentication: string = req.headers['Authentication'] as string;
        if (!authentication) {
            throw new Error('TOKEN is not provided');
        }
        const token = isBearer ? authentication.split(' ')[1] : authentication;

        const content: IPayload = jwt.verify(token, privateKey) as IPayload;
        req['roles'] = content?.roles || [];
    }

    tokenProvider<P extends string | object | Buffer>(privateKey: string, payload: P & IPayload): string {
        return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    }
}

export class JwtMiddleware implements IMiddleware {
    constructor(private readonly jwtAuthService: JwtAuthService, @Inject('ctx') private readonly ctx: IServerContext) {}

    handle(req: e.Request, res: e.Response, next: Function) {
        this.jwtAuthService.requestHandler(req, res, this.ctx.auth.isBearer, this.ctx.auth.secret);
        next();
    }
}
