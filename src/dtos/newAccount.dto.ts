import { IsString } from 'class-validator';

export class NewAccountDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
}
