/* eslint-disable no-unused-vars */
import { CACHE_PREFIX } from './constants';

type ICacheRelations = {
  [k in CACHE_PREFIX]?: CACHE_PREFIX[];
};

/*
 * CACHE RELATIONS
 * [k in CACHE_PREFIX] means if have once add/update/destroy then caches in CACHE_PREFIX array will delete
 * CACHE_PREFIX[] means this cache has foreign key in the models
 * example 1: user_workspaces model has foreign key is staff_type_id. When has any add/update/destroy in staff_types then caches about user_workspaces must delete
 * example 2 job_titles models has foreign key is job_title_group_id. This is parent-children relationship
 */
export const cacheRelations: ICacheRelations = {
  /**
   * Workspace permission
   */
  [CACHE_PREFIX.CACHE_GROUP_PERMISSION]: [
    CACHE_PREFIX.CACHE_USER_WORKSPACE,
    CACHE_PREFIX.CACHE_USER_WORKSPACE_PERMISSION,
    CACHE_PREFIX.CACHE_USER_WORKSPACE_TOKEN,
  ],
  [CACHE_PREFIX.CACHE_USER_WORKSPACE_PERMISSION]: [CACHE_PREFIX.CACHE_USER_WORKSPACE, CACHE_PREFIX.CACHE_USER_WORKSPACE_TOKEN],

  /**
   * User workspace device
   */

  [CACHE_PREFIX.CACHE_USER_WORKSPACE_DEVICE]: [CACHE_PREFIX.CACHE_USER_WORKSPACE_TOKEN],
};
