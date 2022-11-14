import { IPipe } from '../../lib/services/pipe/pipe.interface';

export class UpperCasePipe implements IPipe<string> {
    pipe(value: string): any {
        return value?.toUpperCase();
    }
}
