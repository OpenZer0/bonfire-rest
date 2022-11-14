import { Endpoint } from '../endpoint.decorator';

export function Patch(route: string) {
    return Endpoint({ method: 'patch', route });
}
