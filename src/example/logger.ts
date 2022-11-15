import { ILogger } from '../lib/common/logger/logger.interface';

export class Logger2 implements ILogger {
    constructor(private readonly ctx?: string) {}

    getCtx() {
        return `[${this.ctx}] `;
    }

    log(message: any, ...optionalParams: any[]) {}

    error(message: any, ...optionalParams: any[]) {}

    warn(message: any, ...optionalParams: any[]) {}

    debug?(message: any, ...optionalParams: any[]) {}

    verbose?(message: any, ...optionalParams: any[]) {}
}
