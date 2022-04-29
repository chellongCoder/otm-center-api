import { IsEmail, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class NewAccountDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
}