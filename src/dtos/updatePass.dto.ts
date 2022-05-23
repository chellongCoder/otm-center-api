import { IsString } from 'class-validator';

export class UpdateNewPasswordDto {
  @IsString()
  email: string;
  @IsString()
  code: string;
  @IsString()
  password: string;
}
