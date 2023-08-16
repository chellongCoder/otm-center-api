import { ClassLectures } from '@/models/class-lectures.model';
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Repository } from 'typeorm';
export class UpdateClassLectureDto extends Repository<ClassLectures> {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'name of lecture', example: 'Phép tính cộng' })
  name: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content of lecture', example: 'Học cách tính cộng' })
  content: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'exercise of lecture', example: 'Hãy tính 1 + 1' })
  exercise: string;
}
