import { CategoriesCommentsEnum } from '@/models/comments.model';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class CreateCommentsDto {
  @IsString()
  @IsIn([
    CategoriesCommentsEnum.NEW_POST,
    CategoriesCommentsEnum.HOMEWORK,
    CategoriesCommentsEnum.EVALUATION,
    CategoriesCommentsEnum.APPLIANCE_ABSENT,
    CategoriesCommentsEnum.NOTIFICATION,
    CategoriesCommentsEnum.SCHEDULE_CLASS,
    CategoriesCommentsEnum.SUPPORT,
  ])
  @JSONSchema({ description: 'category', example: CategoriesCommentsEnum.NEW_POST })
  category: CategoriesCommentsEnum;

  @IsString()
  @IsOptional()
  @JSONSchema({
    description:
      'targetKey string format detail_id or detail_$id_user_workspace_$id example with post have id = 1 => targetKey = detail_1. example with homework have timetable id = 1 and userWorkspaceId = 1 => targetKey = detail_1_user_workspace_1',
    example: 'detail_1_user_workspace_1',
  })
  targetKey?: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'url', example: 'https://www.tensorflow.org/static/site-assets/images/marketing/cards/tile_piano.jpg' })
  url?: string;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'sub comment with id of comment parent id', example: 9 })
  parentId?: number;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content', example: 'content' })
  content?: string;
}
