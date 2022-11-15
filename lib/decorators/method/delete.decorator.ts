import { Endpoint } from '../endpoint.decorator';

export function Delete(route: string) {
    return Endpoint({ method: 'delete', route });
}
