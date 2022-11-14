import { LogColors } from './log-colors';

export class Logger {
    constructor(private readonly ctx?: string) {}

    getCtx() {
        return `[${this.ctx}] `;
    }
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log(
            LogColors.FgGreen + this.getCtx() + message + LogColors.Reset,
            optionalParams.length > 0 ? optionalParams : '',
        );
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {
        console.error(
            LogColors.FgRed + this.getCtx() + message + LogColors.Reset,
            optionalParams.length > 0 ? optionalParams : '',
        );
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {
        console.warn(
            LogColors.FgYellow + this.getCtx() + message + LogColors.Reset,
            optionalParams.length > 0 ? optionalParams : '',
        );
    }

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) {
        console.debug(
            LogColors.FgBlue + this.getCtx() + message + LogColors.Reset,
            optionalParams.length > 0 ? optionalParams : '',
        );
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) {
        console.trace(this.getCtx() + message, optionalParams);
    }
}
