import { IsPhoneNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class SendOTPDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0868688942' })
  phoneNumber: string;
}
