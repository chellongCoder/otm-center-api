import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyRecoveryDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 4)
  code: string;
}
