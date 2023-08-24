import { IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UpdateClassTimetableDetailMarkingDto {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'Assessment by teacher for class_lesson exercise', example: 'Bài làm rất tốt' })
  homeworkAssessment: string;

  @IsNumber()
  @JSONSchema({ description: 'Score of assignment by teacher for class_lesson exercise', example: 9 })
  homeworkScore: number;
}
