import { ClassLessons } from '@/models/class-lessons.model';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';

export class ExerciseLinkImages {
  @IsString()
  @JSONSchema({ description: 'link path', example: 'https://github.githubassets.com/images/modules/dashboard/universe23/bg.png' })
  link: string;
}

export class UpdateExerciseClassLessonDto extends Repository<ClassLessons> {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'exercise of timetable', example: 'Hãy tính 1 + 1' })
  exercise: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @JSONSchema({ description: 'list link images up exercise' })
  @Type(() => ExerciseLinkImages)
  exerciseLinkImages: ExerciseLinkImages[];
}
