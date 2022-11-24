import { config } from 'dotenv';
config();

export class Env {
    static get<T = string>(name: string, pipe: (val) => T = (val) => val, def: T): T {
        const value = process.env[name];
        if (!value && !def) {
            throw new Error(`$[{Env.name}]: environment variable not found: ${name} and has no default value`);
        } else if (!value && def != null) {
            return def;
        }
        return pipe(value);
    }

    static asString(name: string, def: string = null): string {
        return this.get<string>(name, (val) => val, def);
    }
    static asNumber(name: string, def: number = null): number {
        return this.get<number>(name, (val) => Number.parseInt(val), def);
    }
    static asFloat(name: string, def: number = null): number {
        return this.get<number>(name, (val) => Number.parseFloat(val), def);
    }
    static asArray(name: string, def: string[] = null): string[] {
        return this.asArrayOfString(name, def);
    }
    static asArrayOfString(name: string, def: string[] = null): string[] {
        return this.get<string[]>(name, (val) => val.split(','), def);
    }
    static asArrayOfNumber(name: string, def: number[] = null): number[] {
        return this.get<number[]>(name, (val) => val.split(',').map((val) => Number.parseInt(val)), def);
    }
    static asArrayOfFloat(name: string, def: number[] = null): number[] {
        return this.get<number[]>(name, (val) => val.split(',').map((val) => Number.parseFloat(val)), def);
    }
}
