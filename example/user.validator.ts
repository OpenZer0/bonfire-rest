import {IsNumber, IsString} from "class-validator";

export class UserValidator {
    @IsString()
    username: string

    @IsNumber()
    age: number
}

export class OtherValidator {
    @IsString()
    lol: string

    @IsString()
    lol2: string

    @IsNumber()
    age: number
}
