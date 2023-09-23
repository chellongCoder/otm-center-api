import { ClassLessons } from '@/models/class-lessons.model';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
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

export class UpdateContentAssignmentDto extends Repository<ClassLessons> {
  @IsString()
  @JSONSchema({ description: 'assignment content', example: '1 + 1 = 2' })
  assignment: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link and note assignment update' })
  @Type(() => AssignmentLinkNotes)
  assignmentLinkNotes: AssignmentLinkNotes[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link images up assignment update' })
  @Type(() => AssignmentLinkNotes)
  assignmentLinkImages: AssignmentLinkNotes[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link images up assignment' })
  @Type(() => AssignmentLinkNotes)
  assignmentLinkVideos: AssignmentLinkNotes[];
}
