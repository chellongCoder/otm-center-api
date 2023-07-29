import { NextFunction, Request as ExpressRequest, Response } from 'express';
import { HttpException } from '@/exceptions/http-exception';
import { logger } from '@utils/logger';
import { LANGUAGES } from '@/constants';
import { Users } from '@/models/users.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { AuthService } from '@/services/auth.service';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import Container from 'typedi';

export interface Request extends ExpressRequest {
  headers: {
    host: string;
    'accept-language'?: string;
    authorization: string;
    'x-build-version': string;
    'x-ts': string;
    'x-device-id': string;
    'x-hash': string;
    'x-workspace-host': string;
    'x-forwarded-for': string;
    'x-socket-id'?: string;
  };
  cms_context: CMSContext;
  mobile_context: MobileContext;
  machine_context: MachineContext;
  file?: Express.Multer.File;
}
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceHost = req.headers['x-workspace-host'];

    const ip = req.headers['x-forwarded-for'];
    const deviceId = req.headers['x-device-id'] ? req.headers['x-device-id'].trim() : '';
    const host = workspaceHost ? workspaceHost : req.headers.host;
    const requestURL = req.originalUrl;
    const requestMethod = req.method;
    /**
     * * Default accept language
     */
    const acceptLanguage = LANGUAGES.VI;
    let accessToken = req.headers['authorization'];

    const context: MobileContext | any = {
      locale: acceptLanguage,
      host,
      user_context: {} as Users,
      workspace_context: {} as Workspaces,
      user_workspace_context: {} as UserWorkspaces,
      ip,
      access_token: accessToken,
      is_owner: false,
      is_super_admin: false,
      hook_context: {},
    };
    console.log('chh_log ---> authMiddleware ---> context:', context);

    try {
      if (!accessToken) {
        throw new Exception(ExceptionName.TOKEN_INVALID, ExceptionCode.FORCE_LOGOUT);
      }

      accessToken = accessToken.replace('Bearer', '').trim();
      const authService = Container.get(AuthService);
      const { user_data: userData, workspace_data } = await authService.checkUserWorkspaceToken({ token: accessToken, workspace_host: host });
      console.log('chh_log ---> authMiddleware ---> workspace_data:', workspace_data);
      console.log('chh_log ---> authMiddleware ---> userData:', userData);

      // // /**
      // //  * Because we need to validate access token expired
      // //  * So we need to get cache after check user token
      // //  */
      // if (cacheData) {
      //   req.mobile_context = cacheData;

      //   return next();
      // }

      // if (userData.is_active) {
      //   context.user_context = userData;

      //   const workspaceData = await Workspaces.findBy.findByHost({
      //     host,
      //     is_active: true,
      //   });

      //   if (!workspaceData) {
      //     throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.FORCE_LOGOUT, 403);
      //   }

      //   const workspaceConfigData = await workspaceConfigsRepository.findOneByFilter({
      //     filter: {
      //       workspace_id: workspaceData.id,
      //       is_active: true,
      //     },
      //   });

      //   const isExcludedRoute = excludedSubscriptionRouters.find(
      //     item => item.method === requestMethod.toLocaleLowerCase() && requestURL.includes(item.route),
      //   );

      //   if (!isExcludedRoute) {
      //     const { remaining_date: remainingDate } = await workspaceSubscriptionsUseCase.checkWorkspaceSubscription({
      //       host,
      //     });

      //     if (remainingDate && remainingDate <= 0) {
      //       throw new Exception(ExceptionName.WORKSPACE_PACKAGE_EXPIRED, ExceptionCode.WORKSPACE_PACKAGE_EXPIRED, 403);
      //     }
      //   }

      //   let userWorkspaceData;
      //   const cacheKey = [
      //     CACHE_PREFIX.CACHE_USER_WORKSPACE,
      //     userData.id,
      //     ENUM_MODEL.VERIFY_STATUS.VERIFIED,
      //     ENUM_MODEL.WORKING_STATUS.WORKING,
      //     workspaceData.id,
      //   ].join(`_`);
      //   const cacheData = await caches.getCaches(cacheKey);
      //   if (cacheData) {
      //     userWorkspaceData = cacheData;
      //   } else {
      //     userWorkspaceData = await userWorkspacesRepository.findOneByFilter({
      //       filter: {
      //         user_id: userData.id,
      //         workspace_id: workspaceData.id,
      //         verify_status: ENUM_MODEL.VERIFY_STATUS.VERIFIED,
      //         working_status: ENUM_MODEL.WORKING_STATUS.WORKING,
      //       },
      //     });
      //     await caches.setCache(cacheKey, userWorkspaceData);
      //   }

      //   if (!userWorkspaceData) {
      //     throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.FORCE_LOGOUT, 403);
      //   }

      //   if (workspaceConfigData?.is_device_censored || workspaceConfigData?.is_account_censored) {
      //     // kiem duyet dang nhap thiet bi
      //     let userWorkspaceDeviceData;
      //     if (deviceId) {
      //       const cacheKeyUserWorkspaceDevice = [CACHE_PREFIX.CACHE_USER_WORKSPACE_DEVICE, workspaceData.host, userWorkspaceData.id].join(`_`);
      //       const cacheDataUserWorkspaceDevice = await caches.getCaches(cacheKeyUserWorkspaceDevice);

      //       if (cacheDataUserWorkspaceDevice) {
      //         userWorkspaceDeviceData = cacheDataUserWorkspaceDevice;
      //       } else {
      //         userWorkspaceDeviceData = await userWorkspaceDevicesRepository.findAllByFilter({
      //           filter: {
      //             workspace_id: workspaceData.id,
      //             user_workspace_id: userWorkspaceData.id,
      //           },
      //         });

      //         await caches.setCache(cacheKeyUserWorkspaceDevice, userWorkspaceDeviceData);
      //       }

      //       let check = false;

      //       if (!userWorkspaceDeviceData) {
      //         check = true;
      //       }

      //       userWorkspaceDeviceData.forEach(item => {
      //         if (item.device_id == deviceId && item.status == DEVICE_STATUS.ACCEPTED) {
      //           check = true;
      //         }
      //       });

      //       if (!check) {
      //         throw new Exception(ExceptionName.USER_WORKSPACE_DEVICE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_DEVICE_NOT_FOUND, 403);
      //       }
      //     }
      //   }

      //   const currentDate = Number(moment().format('YYYYMMDD'));

      //   if (userWorkspaceData.working_status === ENUM_MODEL.WORKING_STATUS.RETIRED && userWorkspaceData.end_work_date >= currentDate) {
      //     throw new Exception(ExceptionName.USER_WORKSPACE_IS_RETIRED_CONTEXT_CASE, ExceptionCode.FORCE_LOGOUT, 403);
      //   }

      //   if (userWorkspaceData.lang) {
      //     context.locale = userWorkspaceData.lang;
      //   }

      //   let superAdminPermission: groupPermissions | null = null;
      //   const cacheKeySuperAdminPermission = [CACHE_PREFIX.CACHE_GROUP_PERMISSION, 'is_active', 'is_super_admin', workspaceData.id].join(`_`);
      //   const cacheDataSuperAdminPermission = await caches.getCaches(cacheKeySuperAdminPermission);
      //   if (cacheDataSuperAdminPermission) {
      //     superAdminPermission = cacheDataSuperAdminPermission;
      //   } else {
      //     superAdminPermission = await groupPermissionsRepository.findOneByFilter({
      //       filter: {
      //         workspace_id: workspaceData.id,
      //         is_active: true,
      //         is_super_admin: true,
      //       },
      //     });

      //     await caches.setCache(cacheKeySuperAdminPermission, superAdminPermission);
      //   }

      //   let organizationIds: string[] = [];
      //   const mobileOrganizationRootIds: string[] = [];
      //   let isSuperAdmin = false;
      //   let canViewOrganization = false;

      //   /**
      //    * * Get context permission of user workspace
      //    */
      //   let userWorkspacePermissions: userWorkspacePermissions[] = [];
      //   const cacheKeyUserWorkspacePermission = [
      //     CACHE_PREFIX.CACHE_USER_WORKSPACE_PERMISSION,
      //     'context',
      //     userWorkspaceData.id,
      //     workspaceData.id,
      //   ].join(`_`);
      //   const cacheDataUserWorkspacePermission = await caches.getCaches(cacheKeyUserWorkspacePermission);
      //   if (cacheDataUserWorkspacePermission) {
      //     userWorkspacePermissions = cacheDataUserWorkspacePermission;
      //   } else {
      //     userWorkspacePermissions = await userWorkspacePermissionsRepository.findAllByFilter({
      //       filter: {
      //         user_workspace_id: userWorkspaceData.id,
      //         workspace_id: workspaceData.id,
      //         is_active: true,
      //       },
      //       includes: [
      //         {
      //           model: groupPermissions,
      //           as: groupPermissions.TABLE_NAME,
      //         },
      //       ],
      //     });
      //     await caches.setCache(cacheKeyUserWorkspacePermission, userWorkspacePermissions);
      //   }

      //   let listGroupPermissionIdsOfUser: string[] = [];

      //   /**
      //    * * Check super admin permission
      //    */
      //   if (userWorkspacePermissions.length) {
      //     listGroupPermissionIdsOfUser = userWorkspacePermissions.map(userWorkspacePermissionItem => userWorkspacePermissionItem.group_permission_id);

      //     if (superAdminPermission && listGroupPermissionIdsOfUser.includes(superAdminPermission.id)) {
      //       context.is_super_admin = true;
      //       isSuperAdmin = true;
      //     }
      //   }

      //   /**
      //    * * Permission of user workspace is based on scope permission of staff or organization
      //    * * And based on job position/manager of organization
      //    */
      //   if (!isSuperAdmin) {
      //     const currentDate = Number(moment().format('YYYYMMDD'));

      //     /**
      //      * * If user is not super admin, check role manager and sub manager of current user
      //      */
      //     const organizationManagersData = await organizationManagersRepository.findAllByFilter({
      //       filter: {
      //         workspace_id: workspaceData.id,
      //         is_active: true,
      //       },
      //       includes: [
      //         {
      //           model: organizations,
      //           as: organizations.TABLE_NAME,
      //           paranoid: true,
      //           required: true,
      //           attributes: ['id'],
      //         },
      //         {
      //           model: userWorkspaces,
      //           as: userWorkspaces.TABLE_NAME,
      //           required: true,
      //           where: {
      //             id: userWorkspaceData.id,
      //             working_status: WORKING_STATUS.WORKING,
      //             is_active: true,
      //           },
      //         },
      //       ],
      //       workspace_id: workspaceData.id,
      //     });

      //     if (organizationManagersData.length) {
      //       organizationIds.push(...organizationManagersData.map(organizationManagerItem => organizationManagerItem.organization_id));
      //       canViewOrganization = true;
      //     }

      //     const jobPositionsData = await jobPositionsRepository.findAllByFilter({
      //       filter: {
      //         workspace_id: workspaceData.id,
      //         is_active: true,
      //         valid_date: { [Op.lte]: currentDate },
      //         [Op.or]: [
      //           {
      //             expires_date: {
      //               [Op.gte]: currentDate,
      //             },
      //           },
      //           {
      //             expires_date: 0,
      //           },
      //         ],
      //         [Op.or]: [
      //           {
      //             is_head_manager: true,
      //           },
      //           {
      //             is_sub_manager: true,
      //           },
      //         ],
      //       },
      //       includes: [
      //         {
      //           model: userWorkspaceJobPositions,
      //           as: userWorkspaceJobPositions.TABLE_NAME,
      //           required: true,
      //           include: [
      //             {
      //               model: userWorkspaces,
      //               as: userWorkspaces.TABLE_NAME,
      //               required: true,
      //               where: {
      //                 id: userWorkspaceData.id,
      //                 working_status: WORKING_STATUS.WORKING,
      //                 is_active: true,
      //               },
      //             },
      //           ],
      //         },
      //       ],
      //       workspace_id: workspaceData.id,
      //     });

      //     if (jobPositionsData.length) {
      //       organizationIds.push(...jobPositionsData.map(jobPositionItem => jobPositionItem.organization_id));
      //       canViewOrganization = true;
      //     }

      //     /**
      //      * * Filter unique to reduce the query of sub organizations
      //      */
      //     organizationIds = _.uniq(organizationIds);

      //     /**
      //      * * Check case filter by organization for mobile
      //      */
      //     let subOrganizationIds: string[] = [];

      //     for (const organizationItemId of organizationIds) {
      //       const subOrganizationsData = await organizationsRepository.getOrganizationsByParentId({
      //         id: organizationItemId,
      //         workspace_id: workspaceData.id,
      //       });

      //       if (!subOrganizationsData) {
      //         continue;
      //       }

      //       const subOrganizationsIdsData = otherHelper.getFieldValueFromNestedObj({ obj: subOrganizationsData, field: 'id' });
      //       subOrganizationIds.push(...subOrganizationsIdsData);
      //     }

      //     subOrganizationIds = _.uniq(subOrganizationIds);
      //     organizationIds.push(...subOrganizationIds);
      //     organizationIds = _.uniq(organizationIds);
      //     mobileOrganizationRootIds.push(...organizationIds);

      //     /**
      //      * * Get scope based on permission
      //      */
      //     const { scope_permission_context } = await permissionsUseCase.contextHelper.getScopePermissionContext({
      //       list_group_permission_ids_of_user: listGroupPermissionIdsOfUser,
      //       workspace_data: workspaceData,
      //       user_workspace_data: userWorkspaceData,
      //     });

      //     let scopePermissionContext = scope_permission_context as IScopePermissionContext;

      //     /**
      //      * * Check empty scope permission. If empty and existed organizationIds length, then set default scopes
      //      */
      //     if (_.isEmpty(scopePermissionContext) && organizationIds.length) {
      //       scopePermissionContext = {
      //         STAFF: {
      //           CAN_VIEW: {
      //             scope_key: SCOPE_PERMISSION_KEY.CUSTOM,
      //             scopes: [...organizationIds],
      //             organization_root_ids: [...mobileOrganizationRootIds],
      //           },
      //           CAN_UPDATE: {
      //             scope_key: SCOPE_PERMISSION_KEY.CUSTOM,
      //             scopes: [...organizationIds],
      //             organization_root_ids: [...mobileOrganizationRootIds],
      //           },
      //         },
      //         ORGANIZATION: {
      //           CAN_VIEW: {
      //             scope_key: SCOPE_PERMISSION_KEY.CUSTOM,
      //             scopes: [...organizationIds],
      //             organization_root_ids: [...mobileOrganizationRootIds],
      //           },
      //           CAN_UPDATE: {
      //             scope_key: SCOPE_PERMISSION_KEY.CUSTOM,
      //             scopes: [...organizationIds],
      //             organization_root_ids: [...mobileOrganizationRootIds],
      //           },
      //         },
      //       };
      //     } else {
      //       for (const scopePermissionKey in scopePermissionContext) {
      //         if (scopePermissionKey !== DEFAULT_PERMISSION_KEY.STAFF && scopePermissionKey !== DEFAULT_PERMISSION_KEY.ORGANIZATION) {
      //           /**
      //            * * In mobile only need to keep organization and staff permissions
      //            */
      //           delete scopePermissionContext[scopePermissionKey];

      //           continue;
      //         }

      //         const scopePermissions = scopePermissionContext[scopePermissionKey];

      //         for (const actionKey in scopePermissions) {
      //           const permissionActionData = scopePermissions[actionKey] as IScopePermissionActionData;

      //           /**
      //            * * Ignore empty
      //            */
      //           if (!permissionActionData || _.isEmpty(permissionActionData)) {
      //             continue;
      //           }

      //           const { scope_key } = permissionActionData;

      //           /**
      //            * * Ignore scope all
      //            */
      //           if (scope_key === SCOPE_PERMISSION_KEY.ALL) {
      //             canViewOrganization = true;

      //             continue;
      //           }

      //           if (!canViewOrganization) {
      //             canViewOrganization = true;
      //           }

      //           /**
      //            * * Note: Manager of each organization only has permission can view and can update
      //            * * Assign permission of organization that user is a manager/submanager with scope CUSTO
      //            */
      //           if (actionKey === PERMISSION_ACTIONS.CAN_VIEW || actionKey === PERMISSION_ACTIONS.CAN_UPDATE) {
      //             permissionActionData.scopes = _.uniq([...permissionActionData.scopes, ...organizationIds]);

      //             permissionActionData.organization_root_ids = _.uniq([...permissionActionData.organization_root_ids, ...organizationIds]);
      //           }
      //         }
      //       }
      //     }

      //     /**
      //      * * Get all organizations
      //      */
      //     let allOrganizationsData: organizations[] = [];
      //     const cacheKeyOrganization = [CACHE_PREFIX.CACHE_ORGANIZATION, workspaceData.id].join(`_`);
      //     const cacheDataOrganization = await caches.getCaches(cacheKeyOrganization);
      //     if (cacheDataOrganization) {
      //       allOrganizationsData = cacheDataOrganization;
      //     } else {
      //       allOrganizationsData = await organizationsRepository.getOrganizations({
      //         workspace_id: workspaceData.id,
      //         separate: true,
      //       });

      //       await caches.setCache(cacheKeyOrganization, allOrganizationsData);
      //     }

      //     const organizationParentsMemoization = organizationsHelper.generateOrganizationParents({
      //       organizations_data: allOrganizationsData,
      //     });

      //     const scopePermissionContextFiltered = permissionsUseCase.contextHelper.generateRootOrganizationIds({
      //       scope_permission_context: scopePermissionContext,
      //       organization_parents_memoization: organizationParentsMemoization,
      //     });

      //     /**
      //      * * Reassign root permission
      //      */
      //     scopePermissionContext = scopePermissionContextFiltered;

      //     const hookContext: IHookContext = {};

      //     hookContext.hook_attributes = {
      //       userContext: userData,
      //       workspaceContext: workspaceData,
      //       userWorkspaceContext: userWorkspaceData,
      //       organizationPermissions: organizationIds,
      //       canViewOrganization,
      //       mobileOrganizationRootIds,
      //       isViewAll: false,
      //       isMobileContext: true,
      //       scopePermissionContext,
      //     };

      //     context.hook_context = hookContext;
      //     console.log(`[scopePermissionContext] > :`, scopePermissionContext);
      //   }

      //   context.user_workspace_context = userWorkspaceData;
      //   context.workspace_context = workspaceData;
      //   context.is_owner = userWorkspaceData.is_owner;
      // }

      // /**
      //  * * Assign as mobile context
      //  */
      req.mobile_context = context;

      //await caches.setCache(cacheKey, context);
    } catch (error) {
      console.log('chh_log ---> authMiddleware ---> error:', error);
      return next(error);
    }

    return next();
  } catch (error) {
    console.log('chh_log ---> authMiddleware1 ---> error:', error);
    next(error);
  }
};

export default authMiddleware;
