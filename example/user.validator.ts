import {IsNumber, IsString} from "class-validator";

export class UserValidator {
    @IsString()
    username: string

    @IsNumber()
    age: number
}
