import express, { Express } from 'express';
import { ServerBuilder } from '../lib/server-builder';
import { E2eController } from './entities/e2e.controller';
import supertest from 'supertest';
import { Logger2 } from '../example/logger';

describe('e2e', () => {
    let server: Express;
    let requestWithSupertest;
    beforeAll(async () => {
        server = await ServerBuilder.build({
            controllers: [E2eController],
            server: express(),
            logger: new Logger2(),
        });
        requestWithSupertest = supertest(server);
    });
    test('add route GET /get and return with the correct response (resolve @Res)', async () => {
        const res = await requestWithSupertest.get('/get');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(JSON.stringify(res.body)).toBe(JSON.stringify({ message: 'good' }));
    });

    test('resolve @Body decorator', async () => {
        const res = await requestWithSupertest.post('/post').send({ message: 'post body', paramTest:{test: 123} }).expect(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(JSON.stringify(res.body.body)).toBe(JSON.stringify({ message: 'post body', paramTest:{test: 123} }));
        expect(JSON.stringify(res.body.bodyParam)).toBe(JSON.stringify({test: 123} ));
    });

    test('resolve @Header decorator', async () => {
        const res = await requestWithSupertest.get('/header').set('custom-header', 'test header').expect(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body.header).toBe('test header');
    });

    test('resolve @Param decorator', async () => {
        const res = await requestWithSupertest.post('/param/foo/foo2').expect(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body.param).toBe('foo');
        expect(JSON.stringify(res.body.params)).toBe(JSON.stringify( {id: "foo", id2: "foo2"}));
    });

    test('pipe test', async () => {
        const res = await requestWithSupertest.post('/pipe/foo').expect(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body.param).toBe('FOO');
    });
});
