![header](https://user-images.githubusercontent.com/48491140/202872887-a486ff15-48d7-4b8b-951d-e07a58a3de0e.png)

# bonfire-rest
###  A REST framework for building backend applications in Node. It is lightweight, easy to learn.
###  Built on [express](https://github.com/expressjs/express) and [type-chef-di](https://github.com/OpenZer0/type-chef-di)

## Installation
tsconfig.json
```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```
## table of contents
- [Example of usage](#example-of-usage)
- [Prefix routes:](#prefix-routes-)
- [Inject endpoint parameters](#inject-endpoint-parameters)
  * [Inject route parameters](#inject-route-parameters)
  * [Inject query parameters](#inject-query-parameters)
  * [Inject request body](#inject-request-body)
  * [Inject request header parameters](#inject-request-header-parameters)
  * [Inject request](#inject-request)
  * [Inject response](#inject-response)
- [Pipes](#pipes)
- [Middlewares](#middlewares)
- [Validation](#validation)
- [OpenAPI](#openapi)
- [Environment variables](#environment-variables)
- [Error handling](#error-handling)
- [DI container](#di-container)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

```
npm install bonfire-rest
```

## Example of usage

1. controller class

```typescript
import { Controller, Param, Body, Get, Post, Put, Delete } from 'bonfire-rest';

@Controller()
export class UserController {
  @Get('/users')
  getAll() {
    return 'This action returns all users';
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return 'This action returns user #' + id;
  }

  @Post('/users')
  post(@Body() user: any) {
    return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}
```

This class will register routes specified in method decorators.

2. Create a file app.ts

```typescript
import { ServerBuilder } from "bonfire-rest";

async function main() {
  const port = Env.asNumber("PORT", 3000); // "Env" converts environment variables to differetnt types (envName, defaultValue)


  const app = express()
  const server = await ServerBuilder.build({ // setup and retun an express server
    controllers: [UserController],
    globalPipes: [ValidationPipe], // ValidationPipe will validate the request Body
    server: app, // optional, if no server provided it will create one
    globalMiddlewares: [LogMiddleware], // use thies middlewares before all actions
    openapi: { // openapi documentation, swagger ui
      spec: {info: {title: "test project", version: "1", description: "this is the test project decription"}, openapi: "3.0.0"}, // additional general informations
      swaggerUi: "/", // specify swagger ui route
      apiDocs: "docs" // specify openapi raw json route
    },
    assetFolders: [{root: "/assets", path: path.join(__dirname, "static")}] // static serve folders
  });

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

main();

```
## Prefix routes:

- **Prefix all controllers routes:** If you want to prefix all your routes, e.g. /api you can use `globalPrefix: "api"` option

- **Prefix controller with base route:** You can prefix all specific controller's actions with base route:

```typescript
@Controller("/users")
export class UserController {
  // ...
}
```

## Inject endpoint parameters
### Inject route parameters

You can use `@Param("...")` decorator to inject parameters in your controller actions:

```typescript
@Get("/users/:id")
getOne(@Param("id") id: string) { 
}
```
If you want to inject all parameters use `@Params()`.

### Inject query parameters

To inject all query parameters, use `@Query()` decorator

To inject specific query parameter, use `@QueryParam("...")` decorator:

```typescript
@Get("/users")
getUsers(@QueryParam("limit") limit: number, @Query() allQueryParam: any) {
}
```

### Inject request body

To inject request body, use `@Body` decorator:

```typescript
@Post("/users")
saveUser(@Body() user: User) {
}
```

To inject request body param, use `@BodyParam("...")` decorator
```typescript
@Post("/users")
saveUser(@Body() user: User, @BodyParam("name") name: string) {
}
```

### Inject request header parameters
To inject request header parameter, use `@Header("...")` decorator.
To inject all request header parameter, use `@Headers()` decorator.

```typescript
@Post("/users")
saveUser(@Header("authorization") token: string) {
}
```
```typescript
@Post("/users")
saveUser(@Headers() allHeader: any) {
}
```
### Inject request
```typescript
@Post("/users")
saveUser(@Req() req: Request) {
}
```

### Inject response
```typescript
@Post("/users")
saveUser(@Res() res: Response) {
}
```

## Pipes
Pipes can modify the value e.g. @Param, @Header, @Query.. You can chain them.
```typescript
export class UpperCasePipe implements IPipe<string> {
  pipe(value: string): any {
    return value?.toUpperCase();
  }
}

@Controller( "ddd")
export class UserController {
    constructor(private readonly foo: FooService) {}

    @Get('/test')
    async getUsers(
      @Req() req: Request,
      @Res() res: Response,
      @QueryParam('name', [UpperCasePipe]) query: any,
    ) {
       return query // if query name got John_Wick the pipe will transformed to JOHN_WICK
    }
    ...
```

## Middlewares

you can specify action middlewares with `@BeforeMiddleware` and `@AfterMiddleware`
- `@BeforeMiddleware` runs before action
- `@AfterMiddleware` runs after action
```typescript
@Injectable()
export class LogMiddleware1 implements IMiddleware {
  constructor(private readonly stringFactory: StringFactory) { // you can use the DI
  }
  handle(req: express.Request, res: express.Response, next: Function) {
    console.log(`${LogMiddleware2.name} : before middleware`)
    next()
  }
}


@Injectable()
export class LogMiddleware2 implements IMiddleware {
  constructor(private readonly stringFactory: StringFactory) { // you can use the DI
  }
  handle(req: express.Request, res: express.Response, next: Function) {
    console.log(`${LogMiddleware3.name} : after middleware`)
    next()
  }
}

// ...
    @BeforeMiddleware(LogMiddleware1)
    @AfterMiddleware(LogMiddleware2, LogMiddleware2) // use as many you want, can be new instance
    @Get('/users')
    getTest(){
        return {user: "test"}
    }
```

## Validation

for the request validation you can use class-validator

```typescript
import {IsEmail, IsString} from "bonfire-rest";
import {IUser} from "../interfaces/user.interface";

export class UserCreateDto implements IUser {
  @IsString()
  username: string

  @IsString()
  password: string

  @IsEmail()
  email: string;

  @IsString()
  password2:string
}


@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  get(){
    return UserModel.find({})
  }

  @Post()
  create(@Body() user: UserCreateDto) {
    if (user.password !== user.password2){
      throw new Error("Password is not the same.")
    }
    return this.userService.create(user);
  }


}

```
If the request body does not match with the class validation class it will throw back an error with the problematic fields


## OpenAPI

Openapi doc and swagger is built in
```typescript
    const server = await ServerBuilder.build({
        controllers: [UsersController],
        openapi: {
            swaggerUi: "api-docs", // swager ui route
            apiDocs: "docs", // raw json doc route
            spec: {info: {title: "test project", version: "1", description: "this is the test project decription"}, openapi: "3.0.0"}, // additional general informations
        }
    });
```

it will automatically add the routes, return types, request body etc. based on class validator classes.

```typescript
  @Post()
  create(@Body() user: UserCreateDto): UserCreteResultDto {
  
  }

```
you can directly specify the result with a class validator claas:

```typescript

  @ApiDocs({
    resultType: UserDto,
    summary: "custom summary",
    description: "this is my description",
    tags: ["user"]
  }) // and more..
  @Post()
  create(@Body() user: any): any {
  
  }

```


## Environment variables
An easy to use helper for process.env variables
```typescript
Env.asString(name, defaultValue) // string
Env.asNumber(name, defaultValue) // number
Env.asFloat(name, defaultValue) // number
Env.asArray(name, defaultValue) // string[]
Env.asArrayOfString(name, defaultValue) // string[] 
Env.asArrayOfNumber(name, defaultValue) // number[] 
Env.asArrayOfFloat(name, defaultValue) // number[] 
```

## Error handling
We provide a helper class for creating http errors: `HttpError`
you can throw built in http errors like `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `InternalServerError`, `NotImplementedError`
```typescript
    @Get('/users')
    getTest() {
        throw new HttpError(404, "my message", {some: "details"})
        throw new NotImplementedError('my message') // provide proper status code, and status code description.
        throw new BadRequestError('my message') // provide proper status code, and status code description.
    }
```
Or create your own, just extend the HttpError class

## DI container
This framework is built on [type-chef-di](https://github.com/OpenZer0/type-chef-di). Visit the repo and learn more about it.
