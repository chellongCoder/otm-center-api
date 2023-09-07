import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class CreateContractCourseDto {
  @IsNumber()
  @JSONSchema({ description: 'courseId', example: 1 })
  courseId: number;

  @IsNumber()
  @JSONSchema({ description: 'courseId', example: 1 })
  discount: number;
}
export class CreateContractDto {
  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id', example: 6 })
  userWorkspaceId: number;

  @IsString()
  @JSONSchema({ description: 'code', example: 'GECKO-HD-4' })
  code: string;

  @IsNumber()
  @JSONSchema({ description: 'đã đóng', example: 100000 })
  paidMoney: number;

  @IsArray()
  @IsOptional()
  @JSONSchema({ description: 'list course in contract' })
  @ValidateNested({ each: true })
  @Type(() => CreateContractCourseDto)
  contractCourses: CreateContractCourseDto[];
}
