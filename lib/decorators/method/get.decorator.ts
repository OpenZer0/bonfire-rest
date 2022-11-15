import { Endpoint } from '../endpoint.decorator';

export function Get(route: string) {
    return Endpoint({ method: 'get', route });
}
