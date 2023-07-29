import { IsPhoneNumber, IsString, Length } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class LoginDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0868688942' })
  phoneNumber: string;

  @IsString()
  @JSONSchema({ description: 'Workspace host(Mã trung tâm)', example: 'gecko.center.edu.vn' })
  host: string;

  @IsString()
  @Length(6, 6)
  @JSONSchema({ description: 'Code receive from twilio sms', example: '123456' })
  code: string;
}
