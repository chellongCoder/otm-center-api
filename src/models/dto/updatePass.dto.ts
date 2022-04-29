import { IsEmail, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class UpdateNewPasswordDto {
  @IsString()
  email: string;
  @IsString()
  code: string;
  @IsString()
  password: string;
}