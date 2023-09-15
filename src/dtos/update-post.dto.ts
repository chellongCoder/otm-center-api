import { PostMediaTypes } from '@/models/post-medias.model';
import { IsArrayOfNumbersConstraint } from '@/utils/validateDto';
import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsIn, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class LinkMediaPostDto {
  @IsString()
  @IsIn([PostMediaTypes.IMAGE_ORIGIN, PostMediaTypes.IMAGE_PATH, PostMediaTypes.VIDEO_PATH, PostMediaTypes.OTHER_PATH], { each: true })
  @JSONSchema({ description: 'type of media link is IMAGE_ORIGIN | IMAGE_PATH | VIDEO_PATH | OTHER_PATH', example: 'IMAGE_PATH' })
  type: PostMediaTypes;

  @IsString()
  @JSONSchema({
    description: 'link of media of url upload image',
    example: 'https://www.tensorflow.org/static/site-assets/images/marketing/cards/tile_piano.jpg?hl=vi',
  })
  link: string;
}
export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @JSONSchema({ description: 'content', example: 'noi dung bai viet' })
  content: string;

  @IsBoolean()
  @JSONSchema({ description: 'pin post', example: true })
  isPin: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @JSONSchema({ description: 'userWorkspace ids in class receive post', example: [1, 2] })
  @Validate(IsArrayOfNumbersConstraint)
  userWorkspaceIdScopes: number[];

  @IsArray()
  @IsOptional()
  @JSONSchema({ description: 'list link media of post' })
  @ValidateNested({ each: true })
  @Type(() => LinkMediaPostDto)
  linkMediaPosts: LinkMediaPostDto[];
}
