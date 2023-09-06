import { AppType } from '@/models/user-workspace-notifications.model';
import { CategoriesNotificationEnum } from '@/utils/rabbit-mq.util';
import { IsArray, IsIn, IsNumber, IsObject, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class BodyPushNotificationDtoDto {
  @IsString()
  @IsIn([AppType.STUDENT, AppType.TEACHER], { each: true })
  @JSONSchema({ description: 'type app', example: 'teacher' })
  type: AppType;

  @IsString()
  @JSONSchema({ description: 'content', example: 'noi dung bai viet' })
  content: string;

  @IsString()
  @JSONSchema({ description: 'category', example: CategoriesNotificationEnum.APPLIANCE_ABSENT })
  category: any;

  @IsNumber()
  @JSONSchema({ description: 'content', example: 1 })
  id: number;

  @IsObject()
  @JSONSchema({ description: 'object', example: {} })
  detail: object;

  @IsArray()
  @JSONSchema({
    description: 'ids playerId ex: da270ea2-f83f-418b-ba6d-59d8f022c0dd is Huy`s device',
    example: ['da270ea2-f83f-418b-ba6d-59d8f022c0dd'],
  })
  playerIds: string[];
}
