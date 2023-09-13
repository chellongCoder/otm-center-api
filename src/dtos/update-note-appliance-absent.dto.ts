import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class UpdateNoteApplianceAbsentsDto {
  @IsString()
  @JSONSchema({ description: 'note update', example: 'cap nhat' })
  note: string;
}
