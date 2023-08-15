import { ClassLessons } from '@/models/class-lessons.model';
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';
export class UpdateClassLessonDto extends Repository<ClassLessons> {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'name of lesson', example: 'Phép tính cộng' })
  name: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content of lesson', example: 'Học cách tính cộng' })
  content: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'exercise of lesson', example: 'Hãy tính 1 + 1' })
  exercise: string;
}
