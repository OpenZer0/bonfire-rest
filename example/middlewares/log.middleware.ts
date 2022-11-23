import { IMiddleware } from "../../lib/middleware/middleware.interface";
import express from "express";
import { Injectable } from "type-chef-di";

@Injectable()
export class StringFactory {
  getStr(){
    return `This is a string from ${StringFactory.name}, DI is working.`
  }
}

@Injectable()
export class LogMiddleware implements IMiddleware {
  constructor(private readonly stringFactory: StringFactory) {
  }
  handle(req: express.Request, res: express.Response, next: Function) {
    console.log(`${LogMiddleware.name} : ${this.stringFactory.getStr()}`)
    next()
  }
}

@Injectable()
export class LogMiddleware2 implements IMiddleware {
  constructor(private readonly stringFactory: StringFactory) {
  }
  handle(req: express.Request, res: express.Response, next: Function) {
    console.log(`${LogMiddleware2.name} : before middleware`)
    next()
  }
}


@Injectable()
export class LogMiddleware3 implements IMiddleware {
  constructor(private readonly stringFactory: StringFactory) {
  }
  handle(req: express.Request, res: express.Response, next: Function) {
    console.log(`${LogMiddleware2.name} : after middleware`)
    next()
  }
}

