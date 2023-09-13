import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UpdateCommentsDto {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'url', example: 'https://www.tensorflow.org/static/site-assets/images/marketing/cards/tile_piano.jpg' })
  url: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content', example: 'content' })
  content: string;
}
