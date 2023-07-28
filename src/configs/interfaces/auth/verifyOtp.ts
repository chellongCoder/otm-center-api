import { IsString } from 'class-validator';

export class VerifyOtpResponse {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
