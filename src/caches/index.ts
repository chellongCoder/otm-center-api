import { CACHE_PREFIX } from './constants';
import { cacheRelations } from './cacheRelations';
import { cacheHelper } from '@/helpers/cache.helper';

export const caches = () => {
  const setCache = async (key: string, value: any, ttl: number = env.CACHE_TTL) => {
    return await cacheHelper.set(key, value, ttl);
  };

  const removeCache = async (key: string) => {
    return await cacheHelperUsage.remove(key);
  };

  const getCaches = async (key: string) => {
    return await cacheHelperUsage.get(key);
  };

  const removeCacheByPattern = async (pattern: string) => {
    return await cacheHelperUsage.delByPattern(pattern);
  };

  const removeCacheWithRelation = async (prefix: CACHE_PREFIX, workspace_id?: string) => {
    const relations = cacheRelations[prefix] || [];
    for (const relation of relations) {
      let patternRelation = relation + '*';
      if (workspace_id) {
        patternRelation += workspace_id;
      }
      await cacheHelperUsage.delByPattern(patternRelation);
    }
    let pattern = prefix + '*';
    if (workspace_id) {
      pattern += workspace_id;
    }
    await cacheHelperUsage.delByPattern(pattern);

    return true;
  };

  return {
    setCache,
    removeCache,
    getCaches,
    removeCacheByPattern,
    removeCacheWithRelation,
  };
};
