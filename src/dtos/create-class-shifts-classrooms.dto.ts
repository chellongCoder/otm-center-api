import { IsISO8601, IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateShiftsClassroomsDto {
  @IsNumber()
  @JSONSchema({ description: 'shift id', example: 1 })
  shiftId: number;

  @IsNumber()
  @JSONSchema({ description: 'classroom id', example: 1 })
  classroomId: number;

  @IsNumber()
  @JSONSchema({ description: 'class id', example: 2 })
  classId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsISO8601()
  @JSONSchema({ description: 'start date apply', example: '2023-08-01' })
  validDate: number;
}
