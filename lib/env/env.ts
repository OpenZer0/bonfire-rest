import { config } from 'dotenv';
config();

export class Env {
    static get(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(`Env not found: ${name}`);
        }
        return value;
    }
    static asString(name: string): string {
        return this.get(name);
    }
    static asNumber(name: string): number {
        return Number.parseInt(this.get(name));
    }
    static asFloat(name: string): number {
        return Number.parseFloat(this.get(name));
    }
    static asArray(name): string[] {
        return this.asArrayOfString(name);
    }
    static asArrayOfString(name): string[] {
        return this.get(name).split(',');
    }
    static asArrayOfNumber(name: string): number[] {
        return this.asArrayOfString(name).map((val) => Number.parseInt(val));
    }
    static asArrayOfFloat(name: string): number[] {
        return this.asArrayOfString(name).map((val) => Number.parseFloat(val));
    }
}
