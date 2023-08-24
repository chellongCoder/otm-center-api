import { IsArrayOfNumbersConstraint } from '@/utils/validateDto';
import { IsArray, IsString, Validate } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class ApplianceAbsentsDto {
  @IsString()
  @JSONSchema({ description: 'Phone number', example: 'Bị cảm cúm ạ' })
  note: string;

  @IsArray()
  @Validate(IsArrayOfNumbersConstraint)
  @JSONSchema({ description: 'id buổi học xin nghỉ', example: [145, 146] })
  timetableIds: number[];
}
