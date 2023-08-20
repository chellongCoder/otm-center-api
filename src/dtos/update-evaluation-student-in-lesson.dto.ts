import { IsArrayOfNumbersConstraint } from '@/utils/validateDto';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class EvaluationDetails {
  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id: student are updated status', example: 6 })
  evaluationCriteriaId: number;

  @IsArray()
  @IsOptional()
  @Validate(IsArrayOfNumbersConstraint)
  @JSONSchema({ description: 'user_workspace_id: student are updated status', example: [1, 2] })
  evaluationOptionValueIds: number[];

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'value of evaluation', example: '10 điểm' })
  value: string;
}

export class UpdateEvaluationInLessonDto {
  @IsNumber()
  @JSONSchema({ description: 'timetable id', example: 143 })
  timetableId: number;

  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id: teacher update status', example: 7 })
  userWorkspaceId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'summary evaluation note', example: 'Học sinh cả lớp học tập trung' })
  evaluationNote?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'detail evaluation' })
  @Type(() => EvaluationDetails)
  evaluationDetails: EvaluationDetails[];

  @IsArray()
  @IsOptional()
  @JSONSchema({ description: 'userWorkspace ids publish evaluation', example: [1, 2] })
  @Validate(IsArrayOfNumbersConstraint)
  userWorkspacePublishIds: number[];

  @IsArray()
  @IsOptional()
  @Validate(IsArrayOfNumbersConstraint)
  @JSONSchema({ description: 'userWorkspace ids not publish evaluation', example: [1, 2] })
  userWorkspacePrivateIds: number[];
}
