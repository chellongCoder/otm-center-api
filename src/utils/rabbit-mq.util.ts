import { AppType } from '@/models/user-workspace-notifications.model';
import { logger } from '@utils/logger';
import { RabbitClient } from '@utils/rabbit';
import config from 'config';
export enum CategoriesNotificationEnum {
  APPLIANCE_ABSENT = 'APPLIANCE_ABSENT',
  EVALUATION = 'EVALUATION',
  HOMEWORK = 'HOMEWORK',
  SCHEDULE_CLASS = 'SCHEDULE_CLASS',
  NEW_POST = 'NEW_POST',
  COMMENT = 'COMMENT',
  REGISTER_STUDENT = 'REGISTER_STUDENT',
  REGISTER_TEACHER = 'REGISTER_TEACHER',
  NOTIFICATION = 'NOTIFICATION',
}
export type DataMessageNotificationRabbit = {
  content: string;
  category: CategoriesNotificationEnum;
  id?: number;
  detail?: object;
  playerIds: string[];
};
export type SendMessageNotificationRabbit = {
  type: AppType;
  data: DataMessageNotificationRabbit;
};
// { "type": "teacher", "data": {"content": "Hello Test", "playerIds": ["d0699965-b886-4aa5-a5a0-abc106a451ab"] } }
// const msg = {
//   type: 'teacher',
//   data: {
//     content: 'noi dung bai viet123',
//     category: 'EVALUATION',
//     id: 143,
//     detail: {},
//     playerIds: ['57369201-585f-4a94-98c4-a63a91f781b9'],
//   },
// };
export const sendNotificationToRabbitMQ = async (msg: SendMessageNotificationRabbit) => {
  try {
    logger.info(`Send: ${JSON.stringify(msg)}`);
    let { AMQBSERVER_LINK = '', QUEUE_ORDER_SEND_NOTI_NAME = '' } = process.env;
    if (!AMQBSERVER_LINK) {
      AMQBSERVER_LINK = config.get('notification.AMQBSERVER_LINK');
    }
    if (!QUEUE_ORDER_SEND_NOTI_NAME) {
      QUEUE_ORDER_SEND_NOTI_NAME = config.get('notification.QUEUE_ORDER_SEND_NOTI_NAME');
    }
    const rabbitClient = RabbitClient.getInstanceForQueue(QUEUE_ORDER_SEND_NOTI_NAME);
    await rabbitClient.connect(AMQBSERVER_LINK, QUEUE_ORDER_SEND_NOTI_NAME);
    await rabbitClient.send(msg);
  } catch (error) {
    throw error;
  }
};
