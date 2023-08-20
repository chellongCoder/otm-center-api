import { IsPhoneNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateUserDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0868688942' })
  phoneNumber: string;
}
