import { IsEmail, IsUrl } from 'class-validator';

export class ForgotDto {
  @IsEmail()
  email: string;

  @IsUrl()
  forgotUrl: string;

  @IsUrl()
  errorUrl: string;
}
