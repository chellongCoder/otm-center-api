import { IsPhoneNumber, IsString, Length } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class VerifyOtpDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0823820890' })
  phone: string;

  @IsString()
  @Length(6, 6)
  @JSONSchema({ description: 'JWT Access token' })
  code: string;
}
