import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateShiftDto {
  @IsString()
  @JSONSchema({ description: 'from time shift ex: 18:00:00', example: '180000' })
  fromTime: string;

  @IsString()
  @JSONSchema({ description: 'to time shift ex: 20:00:00', example: '200000' })
  toTime: string;

  @IsNumber()
  @JSONSchema({ description: 'workspace_id', example: 1 })
  workspaceId: number;

  @IsBoolean()
  @JSONSchema({ description: 'set true or set false and set array params weekdays ', example: true })
  isEveryday: boolean;

  @IsArray()
  @IsIn([0, 1, 2, 3, 4, 5, 6], { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsOptional()
  @JSONSchema({ description: 'day of week set from monday is 1, tuesday is 2 to sunday is 0', example: [1, 2] })
  weekdays: number[];
}
