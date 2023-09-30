import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Request as ExpressRequest } from 'express';

import { Action } from 'routing-controllers';
import { LANGUAGES } from '@/constants';
import { Users } from '@/models/users.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { AuthService } from '@/services/auth.service';
import Container from 'typedi';
import { UserWorkspacePermissions } from '@/models/user-workspace-permissions.model';
import { IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import moment from 'moment-timezone';
import { PermissionKeys } from '@/models/permissions.model';
import { CACHE_PREFIX } from '@/caches/constants';
import { caches } from '@/caches';

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
  mobile_context: MobileContext;
}

export interface MobileContext {
  locale: LANGUAGES;
  user_context: UserWorkspaces;
  workspace_context: Workspaces;
  user_workspace_context: UserWorkspaces;
  host: string;
  ip: string;
  access_token: string;
  is_super_admin: boolean;
  is_owner: boolean;
  user_workspace_permission: PermissionKeys;
  // hook_context: IHookContext;
}
export function authMiddleware(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const { request, response, context, next } = action;
    const authService = Container.get(AuthService);

    const workspaceHost = request.headers['x-workspace-host'];

    const ip = request.headers['x-forwarded-for'];
    // const deviceId = request.headers['x-device-id'] ? request.headers['x-device-id'].trim() : '';
    const host = workspaceHost ? workspaceHost : request.headers.host;
    // const requestURL = request.originalUrl;
    // const requestMethod = request.method;
    /**
     * * Default accept language
     */
    const acceptLanguage = LANGUAGES.VI;
    let accessToken = request.headers['authorization'];

    const mobileContext: MobileContext | any = {
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

    if (!accessToken) {
      throw new Exception(ExceptionName.TOKEN_INVALID, ExceptionCode.FORCE_LOGOUT);
    }

    accessToken = accessToken.trim();
    const { user_workspace_data, workspace_data } = await authService.checkUserWorkspaceToken({ token: accessToken, workspace_host: host });

    mobileContext['user_workspace_context'] = user_workspace_data;
    mobileContext['workspace_context'] = workspace_data;
    if (user_workspace_data.isOwner) {
      mobileContext['is_owner'] = true;
    }
    if (roles && roles.length) {
      const cacheKey = [CACHE_PREFIX.CACHE_USER_WORKSPACE_PERMISSION, user_workspace_data.id, workspace_data.id].join(`_`);
      let permissionData: UserWorkspacePermissions | null = null;
      const cacheData = await caches().getCaches(cacheKey);
      if (cacheData) {
        permissionData = cacheData;
      } else {
        permissionData = await UserWorkspacePermissions.findOne({
          where: [
            {
              userWorkspaceId: user_workspace_data.id,
              workspaceId: workspace_data.id,
              validDate: LessThanOrEqual(moment().toDate()),
              expiresDate: IsNull(),
            },
            {
              userWorkspaceId: user_workspace_data.id,
              workspaceId: workspace_data.id,
              validDate: LessThanOrEqual(moment().toDate()),
              expiresDate: MoreThanOrEqual(moment().toDate()),
            },
          ],
          relations: ['permission'],
        });
        await caches().setCache(cacheKey, permissionData);
      }

      if (permissionData && !roles.find(role => permissionData.permission.key.indexOf(role) !== -1)) {
        throw new Exception(ExceptionName.PERMISSION_DENIED, ExceptionCode.PERMISSION_DENIED);
      }
      mobileContext['user_workspace_permission'] = permissionData?.permission.key;
    }

    // /**
    //  * * Assign as mobile context
    //  */
    request.mobile_context = mobileContext;

    //await caches.setCache(cacheKey, context);

    return true;
  };
}
