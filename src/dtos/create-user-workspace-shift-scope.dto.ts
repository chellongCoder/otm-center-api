import { TitleShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsISO8601, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UserWorkspaceShiftScopesDto {
  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id', example: 1 })
  userWorkspaceId: number;

  @IsString()
  @JSONSchema({ description: 'from time shift ex: 18:00:00', example: '180000' })
  fromTime: string;

  @IsString()
  @JSONSchema({ description: 'to time shift ex: 20:00:00', example: '200000' })
  toTime: string;

  @IsString()
  @IsIn([TitleShiftScopes.TEACHER, TitleShiftScopes.TUTORS], { each: true })
  @JSONSchema({ description: 'title is TEACHER or TUTORS', example: 'TEACHER' })
  title: TitleShiftScopes;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'note', example: 'ghi chu day' })
  note: string;
}
export class CreateClassScheduleDto {
  @IsNumber()
  @JSONSchema({ description: 'shift id', example: 1 })
  shiftId: number;

  @IsNumber()
  @JSONSchema({ description: 'classroom id', example: 2 })
  classroomId: number;

  @IsNumber()
  @JSONSchema({ description: 'class id', example: 2 })
  classId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsISO8601()
  @JSONSchema({ description: 'date apply value is start_time of course', example: '2023-08-05' })
  validDate: string;

  @IsArray()
  @JSONSchema({ description: 'list user_workspace assign to shiftScopes' })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UserWorkspaceShiftScopesDto)
  userWorkspaces: UserWorkspaceShiftScopesDto[];
}
