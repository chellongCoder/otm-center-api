import { IsFQDN, IsString } from 'class-validator';

export class FileDto {
  @IsString()
  originalFile: string;

  @IsFQDN()
  url: string;
}
