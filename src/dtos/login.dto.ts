import { IsPhoneNumber, IsString, Length } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class LoginDto {
  @IsPhoneNumber('VN')
  @JSONSchema({ description: 'Phone number', example: '0823820890' })
  phoneNumber: string;

  @IsString()
  @JSONSchema({ description: 'Workspace host(Mã trung tâm)' })
  host: string;

  @IsString()
  @Length(6, 6)
  @JSONSchema({ description: 'Code receive from twilio sms' })
  code: string;
}
