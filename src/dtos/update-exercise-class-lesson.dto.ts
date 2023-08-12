import { ClassLessons } from '@/models/class-lessons.model';
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';
export class UpdateExerciseClassLessonDto extends Repository<ClassLessons> {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'exercise of timetable', example: 'Hãy tính 1 + 1' })
  exercise: string;
}
