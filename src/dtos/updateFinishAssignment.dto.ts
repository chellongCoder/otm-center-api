import { ClassLessons } from '@/models/class-lessons.model';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';

export class AssignmentLinkNotes {
  @IsString()
  @JSONSchema({ description: 'link path', example: 'https://translate.google.com/' })
  link: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'description link', example: 'Dịch tiếng anh' })
  note: string;
}

export class UpdateFinishAssignmentDto extends Repository<ClassLessons> {
  @IsNumber()
  @JSONSchema({ description: 'timetable id', example: 100 })
  timetableId: number;

  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id', example: 1 })
  userWorkspaceId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsString()
  @JSONSchema({ description: 'assignment content', example: '1 + 1 = 2' })
  assignment: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link and note assignment' })
  @Type(() => AssignmentLinkNotes)
  assignmentLinkNotes: AssignmentLinkNotes[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link images up assignment' })
  @Type(() => AssignmentLinkNotes)
  assignmentLinkImages: AssignmentLinkNotes[];
}
