import { Injectable } from 'type-chef-di';

@Injectable()
export class FooService {
    getStr() {
        return 'from foo service';
    }
}
