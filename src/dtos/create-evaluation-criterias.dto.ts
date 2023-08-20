import { EvaluationTypes } from '@/models/evaluation-criterias.model';
import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class EvaluationOptionValuesDto {
  @IsString()
  @JSONSchema({ description: 'value of evaluation option', example: 'Lựa chọn 1' })
  value: string;
}
export class CreateEvaluationCriteriaDto {
  @IsString()
  @JSONSchema({ description: 'name of evaluation criteria', example: 'Tiêu chí tính điểm' })
  name: string;

  @IsString()
  @IsIn([EvaluationTypes.MULTIPLE_OPTIONS, EvaluationTypes.ONE_OPTION, EvaluationTypes.SCORE, EvaluationTypes.TEXT], { each: true })
  @JSONSchema({ description: 'type of evaluation criteria', example: EvaluationTypes.SCORE })
  type: EvaluationTypes;

  @IsBoolean()
  @IsOptional()
  @JSONSchema({ description: 'status of evaluation criteria default is true', example: true })
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'maximumScore of evaluation criteria', example: 10 })
  maximumScore: number;

  @IsNumber()
  @JSONSchema({ description: 'dailyEvaluationId of evaluation criteria', example: 5 })
  dailyEvaluationId: number;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsArray()
  @JSONSchema({ description: 'evaluationOptionValues of evaluation criteria' })
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EvaluationOptionValuesDto)
  evaluationOptionValues: EvaluationOptionValuesDto[];
}
