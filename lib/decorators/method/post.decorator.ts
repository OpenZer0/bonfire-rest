import { Endpoint } from '../endpoint.decorator';

export function Post(route: string = '/') {
    return Endpoint({ method: 'post', route });
}
