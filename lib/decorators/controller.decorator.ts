import { Injectable } from 'type-chef-di';

export function Controller() {
    return Injectable({ instantiation: 'singleton' });
}
