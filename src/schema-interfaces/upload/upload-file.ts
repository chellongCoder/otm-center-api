import { FileDto } from '@/dtos/file.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class UploadFileResponse {
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  data: FileDto;
}
