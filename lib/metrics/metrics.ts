import { IMiddleware } from '../middleware/middleware.interface';
import e from 'express';
import { Injectable } from 'type-chef-di';

export interface IStats {
    endpoint: string;
    requestCount: number;
    responseCodeCount?: Record<number, number>;
}

@Injectable({ instantiation: 'singleton' })
export class Metrics {
    static stats: Map<string, IStats> = new Map();

    static increment(route: string) {
        this.stats.set(route, {
            endpoint: route,
            requestCount: (this.stats.get(route)?.requestCount || 0) + 1,
            responseCodeCount: this.stats.get(route)?.responseCodeCount || {},
        });
    }

    static setResponseStat(route, status) {
        if (!this.stats.has(route)) {
            this.increment(route);
        }
        const stat = this.stats.get(route);
        stat.responseCodeCount[status] = (stat.responseCodeCount[status] || 0) + 1;
        this.stats.set(route, stat);
    }
}

@Injectable()
export class RequestCounterMiddleware implements IMiddleware {
    handle(req: e.Request, res: e.Response, next: Function) {
        Metrics.increment(req.path);
        next();
    }
}
