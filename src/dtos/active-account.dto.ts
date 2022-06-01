import { IsString } from 'class-validator';

export class ActiveAccountDto {
  @IsString()
  password: string;
}
