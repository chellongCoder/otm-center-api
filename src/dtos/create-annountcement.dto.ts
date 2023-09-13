import { IsArrayOfNumbersConstraint } from '@/utils/validateDto';
import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateAnnouncementDto {
  @IsString()
  @JSONSchema({ description: 'title', example: 'Thong bao moi' })
  title: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content', example: 'Noi dung thong bao moi' })
  content: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'url image', example: 'https://www.tensorflow.org/static/site-assets/images/marketing/cards/tile_piano.jpg' })
  url: string;

  @IsBoolean()
  @JSONSchema({ description: 'isImportant', example: false })
  isImportant: boolean;

  @IsBoolean()
  @JSONSchema({ description: 'allowComment', example: true })
  allowComment: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @Validate(IsArrayOfNumbersConstraint)
  @JSONSchema({ description: 'user_workspaces receive Announcement', example: [1, 2] })
  userWorkspaceIds: number[];
}
