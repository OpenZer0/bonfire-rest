import { Keys } from 'type-chef-di';
import { Constants } from '../Constants';

export function Controller(prefix: string) {
    return (target: Function) => {
        let metadata: any = Reflect.getMetadata(Constants.CONTROLLER_KEY, target) || {};
        metadata = { ...metadata, prefix };
        Reflect.defineMetadata(Constants.CONTROLLER_KEY, metadata, target);
        addInjectableMeta(target);
    };
}

function addInjectableMeta(target: any) {
    const metadata: any = Reflect.getMetadata(Keys.INJECTABLE_KEY, target) || {};
    metadata[Keys.INJECTABLE_KEY] = { instantiation: 'singleton' };
    Reflect.defineMetadata(Keys.INJECTABLE_KEY, metadata, target);
}
