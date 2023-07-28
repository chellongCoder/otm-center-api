import { IsPhoneNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class PhoneLoginDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0823820890' })
  phone: string;
}
