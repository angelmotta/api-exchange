import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserRequestDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
