import { IsString, IsBoolean } from 'class-validator';

export class SendOTPResponse {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}
