import { IsString, IsBoolean } from 'class-validator';

export class LoginSmsResponse {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}
