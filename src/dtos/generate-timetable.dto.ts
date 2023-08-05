import { IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class GenerateTimetableDto {
  @IsNumber()
  @JSONSchema({ description: 'class generate timetable', example: 2 })
  classId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;
}
