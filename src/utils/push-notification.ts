// import { Vehicles } from './../models/vehicles.model';
// import { MessageUtils } from '@/utils/message';
// import { SendNotificationWithRabbit, AppType, SendNotificationOrderTypeEnum } from '@utils/rabbit';
// import { Not, IsNull } from 'typeorm';
// import { Driver } from '@models/driver.model';
// import { CreateNotificationRecordDTO } from '@dtos/notification.dto';
// import { ADMIN_HAS_NEW_DRIVER_PARTNER } from '@/common/message.enum';
// import { Notification, NotificationType } from '@models/notification.model';
// import { RoleEnum, superAdminInSystem } from '@/common/role.enum';
// import { Account } from '@models/accounts.model';
// import { HandleError } from '@/common/error.response';
// import { Service } from 'typedi';

// @Service()
// export class NotificationService {
//   async getListAdmin() {
//     return await Account.createQueryBuilder('accounts')
//       .innerJoin('accounts.systemRoles', 'systemRoles', 'systemRoles.name = :superAdminInSystem', { superAdminInSystem })
//       .getMany();
//   }

//   async createNotificationForAdmin(notificationType: NotificationType, driver?: Driver, vehicleData?: Vehicles) {
//     try {
//       const accounts = await this.getListAdmin();
//       let title = '';
//       switch (notificationType) {
//         case NotificationType.NOTIFY_DRIVER_PARTNER_REGISTER:
//           title = ADMIN_HAS_NEW_DRIVER_PARTNER;
//       }

//       const adminNotificationRecord = (accounts || []).map((account: Account) => {
//         const inputCreateNotiAdmin: CreateNotificationRecordDTO = {
//           ref: RoleEnum.ADMIN,
//           title,
//           refId: account.id,
//           content: {
//             driverId: driver ? driver.id : '',
//             vehicleId: vehicleData ? vehicleData.id : '',
//           },
//         };
//         const drvierNotificationRecord = Notification.create({ ...inputCreateNotiAdmin });
//         return drvierNotificationRecord;
//       });
//       return await Notification.save(adminNotificationRecord);
//     } catch (error) {
//       HandleError(error);
//     }
//   }

//   async sendNotifyToRef(notification: Notification) {
//     const { id, content, refId, ref, title } = notification;
//     const usersData = await Account.findOne({ where: { id: refId, player_id: Not(IsNull()) } });

//     if (!usersData) {
//       return;
//     }
//     const msg: SendNotificationWithRabbit = {
//       app: AppType.Admin,
//       type: SendNotificationOrderTypeEnum.NOTIFICATION,
//       to: [usersData.player_id],
//       template: '',
//       message: title,
//       params: { id, ...content },
//     };
//     await MessageUtils.sendNotificationToRabbitMQ(msg);
//   }
// }
