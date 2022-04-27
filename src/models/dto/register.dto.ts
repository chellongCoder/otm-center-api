import { IsEmail, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  phone: string;
  @IsString()
  name: string;
}