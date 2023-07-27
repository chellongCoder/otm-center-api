import { IsString } from 'class-validator';

export class LoginResponse {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
