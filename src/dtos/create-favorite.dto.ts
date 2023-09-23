import { IsNumber, IsOptional } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
export class CreateFavoriteDto {
  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'postId', example: 1 })
  postId: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({ description: 'announcementId', example: 1 })
  announcementId: number;
}
