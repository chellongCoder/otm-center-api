import { IsEmail, IsNumber, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class ActiveAccountDto {
  @IsString()
  password: string;
}