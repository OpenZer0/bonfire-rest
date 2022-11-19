![DALL·E 2022-11-16 15 59 24 - bonfire, cyberpunk style, code background](https://user-images.githubusercontent.com/48491140/202872887-a486ff15-48d7-4b8b-951d-e07a58a3de0e.png)

# bonfire-rest
### REST framework built on [express](https://github.com/expressjs/express) and [type-chef-di](https://github.com/OpenZer0/type-chef-di)

# <span style="color: green">  !! the package is not released yet!! coming soon. </span>

# Installation
tsconfig.json
```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```
```
npm install bonfire-rest // soon
```

# Example of usage

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
import { ValidationPipe } from "bonfire-rest/services/pipe/validation.pipe";
import { UsersController } from "./users/controllers/users.controller";

async function main() {

    const port = 3000;
    const server = await ServerBuilder.build({
        controllers: [UsersController],
        globalPipes: [ValidationPipe],
        globalPrefix: "api",
        globalMiddlewares: [],
        openapi: {
            swaggerUi: "api-docs",
            apiDocs: "docs",
            title: "my-app"
        }
    });

    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

main();
```

## Prefix all controllers routes

If you want to prefix all your routes, e.g. /api you can use `globalPrefix: "api"` option



## Prefix controller with base route

You can prefix all specific controller's actions with base route:

```typescript
@Controller({prefix: "/users"})
export class UserController {
  // ...
}
```

## Inject route parameters

You can use `@Param` decorator to inject parameters in your controller actions:

```typescript
@Get("/users/:id")
getOne(@Param("id") id: string) { 
}
```
If you want to inject all parameters use `@Param()`.

## Inject query parameters

To inject query parameters, use `@Query` decorator:

```typescript
@Get("/users")
getUsers(@Query("limit") limit: number) {
}
```

## Inject request body

To inject request body, use `@Body` decorator:

```typescript
@Post("/users")
saveUser(@Body() user: User) {
}
```

## Inject request body parameters
To inject request body parameter, use @Body decorator with first param:

```typescript
@Post("/users")
saveUser(@Body("name") userName: string) {
}
```

## Inject request header parameters
To inject request header parameter, use `@Header` decorator:

```typescript
@Post("/users")
saveUser(@Header("authorization") token: string) {
}
```
If you want to inject all header parameters use `@Header()` decorator.

## Inject request
```typescript
@Post("/users")
saveUser(@Req() req: Request) {
}
```

## Inject response
```typescript
@Post("/users")
saveUser(@Res() res: Response) {
}
```

# Validation

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


@Controller({prefix: "users"})
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
            title: "my-app"
        }
    });
```

it will automatically add the routes, return types, request body etc. based on class validator classes.

```typescript
  @Post()
  create(@Body() user: UserCreateDto): UserCreteResultDto {
  
  }

```
