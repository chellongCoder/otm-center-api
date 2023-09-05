import { WorkerConstant } from '@/constants';
import { logger } from '@utils/logger';
import { RabbitClient } from '@utils/rabbit';
export enum AppType {
  teacher = 'teacher',
  student = 'student',
  admin = 'admin',
}
export enum SendNotificationOrderTypeEnum {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  NOTIFICATION = 'NOTIFICATION',
}
export enum SendProcessOrderType {
  FIND_DRIVER = 'FIND_DRIVER',
}
export type SendNotificationWithRabbit = {
  app: AppType;
  type: SendNotificationOrderTypeEnum;
  to: string | string[]; // email hoặc phone, phone phai bat dau bang +84
  template?: string; // phai co 1 trong 2 template hoac message
  message?: string;
  params?: object;
};

export type SendMessageExecuteNotiSetup = {
  id: number;
};

export type SendProcessOrderWithRabbit = {
  type: SendProcessOrderType;
  data: object;
};
export type DataMessageNotificationRabbit = {
  content: string;
  playerIds: string[];
};
export type SendMessageNotificationRabbit = {
  type: AppType;
  data: DataMessageNotificationRabbit;
};
// { "type": "teacher", "data": {"content": "Hello Test", "playerIds": ["d0699965-b886-4aa5-a5a0-abc106a451ab"] } }
export const sendNotificationToRabbitMQ = async (msg: SendMessageNotificationRabbit) => {
  try {
    logger.info(`Send: ${JSON.stringify(msg)}`);
    const { AMQBSERVER_LINK = '', QUEUE_ORDER_SEND_NOTI_NAME = '' } = process.env;
    const rabbitClient = RabbitClient.getInstanceForQueue(QUEUE_ORDER_SEND_NOTI_NAME);
    await rabbitClient.connect(AMQBSERVER_LINK, QUEUE_ORDER_SEND_NOTI_NAME);
    await rabbitClient.send(msg);
  } catch (error) {
    throw error;
  }
};

export const sendNotificationToRabbitMQProcessService = async (msg: SendProcessOrderWithRabbit | SendNotificationWithRabbit) => {
  try {
    logger.info(`Send: ${JSON.stringify(msg)}`);
    const { AMQBSERVER_LINK = '', QUEUE_ORDER_SEND_NOTI_PROCESS_NAME = '' } = process.env;
    const rabbitClient = RabbitClient.getInstanceForQueue(QUEUE_ORDER_SEND_NOTI_PROCESS_NAME);
    await rabbitClient.connect(AMQBSERVER_LINK, QUEUE_ORDER_SEND_NOTI_PROCESS_NAME);
    await rabbitClient.send(msg);
  } catch (error) {
    throw error;
  }
};

export const sendMessageExecuteNotificationSetupToRabbitMQ = async (msg: any) => {
  try {
    logger.info(`Send: ${JSON.stringify(msg)}`);
    const { AMQBSERVER_LINK = '' } = process.env;
    const rabbitClient = RabbitClient.getInstanceForQueue(WorkerConstant.WORKING_SEND_NOTIFICATION_SETUP);

    await rabbitClient.connect(AMQBSERVER_LINK, WorkerConstant.WORKING_SEND_NOTIFICATION_SETUP);
    await rabbitClient.send(msg);
  } catch (error) {
    throw error;
  }
};
