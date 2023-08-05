import { IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CheckShiftClassroomDto {
  @IsNumber()
  @JSONSchema({ description: 'shift id', example: 1 })
  shiftId: number;

  @IsNumber()
  @JSONSchema({ description: 'classroom id', example: 1 })
  classroomId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;
}
