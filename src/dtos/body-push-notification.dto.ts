import { AppType } from '@/utils/rabbit-mq.util';
import { IsArray, IsIn, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class BodyPushNotificationDtoDto {
  @IsString()
  @IsIn([AppType.student, AppType.teacher, AppType.admin], { each: true })
  @JSONSchema({ description: 'type app', example: 'teacher' })
  type: AppType;

  @IsString()
  @JSONSchema({ description: 'content', example: 'noi dung bai viet' })
  content: string;

  @IsArray()
  @JSONSchema({
    description: 'ids playerId ex: da270ea2-f83f-418b-ba6d-59d8f022c0dd is Huy`s device',
    example: ['da270ea2-f83f-418b-ba6d-59d8f022c0dd'],
  })
  playerIds: string[];
}
