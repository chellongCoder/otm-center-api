import { SupportStudentTypes } from '@/models/user-workspace-supports.model';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UserWorkspaceSupportDto {
  @IsString()
  @JSONSchema({ description: 'content', example: 'ho tro abc' })
  content: string;

  @IsString()
  @IsOptional()
  @IsIn([SupportStudentTypes.COMPlAIN, SupportStudentTypes.SUPPORT], { each: true })
  @JSONSchema({ description: 'SupportTypes', example: SupportStudentTypes.SUPPORT })
  supportStudentType: SupportStudentTypes;

  @IsArray()
  @IsOptional()
  @JSONSchema({ description: 'list link media of support' })
  images: string[];
}
