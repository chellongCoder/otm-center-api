import config from 'config';
import { CACHE_PREFIX } from './constants';
import { cacheRelations } from './cacheRelations';
import { cacheHelper } from '@/helpers/cache.helper';

export const caches = () => {
  const setCache = async (key: string, value: any, ttl?: number) => {
    if (ttl) {
      return await cacheHelper().set(key, value, ttl);
    } else {
      if (process.env.REDIS_TTL) {
        const ttlConfig: number = Number(process.env.REDIS_TTL) || 1;
        return await cacheHelper().set(key, value, ttlConfig);
      } else if (config.get('redis.ttl')) {
        const ttlConfig: number = Number(config.get('redis.ttl')) || 1;
        return await cacheHelper().set(key, value, ttlConfig);
      }
    }
  };

  const removeCache = async (key: string) => {
    return await cacheHelper().remove(key);
  };

  const getCaches = async (key: string) => {
    return await cacheHelper().get(key);
  };

  const removeCacheByPattern = async (pattern: string) => {
    return await cacheHelper().delByPattern(pattern);
  };

  const removeCacheWithRelation = async (prefix: CACHE_PREFIX, workspace_id?: string) => {
    const relations = cacheRelations[prefix] || [];
    for (const relation of relations) {
      let patternRelation = relation + '*';
      if (workspace_id) {
        patternRelation += workspace_id;
      }
      await cacheHelper().delByPattern(patternRelation);
    }
    let pattern = prefix + '*';
    if (workspace_id) {
      pattern += workspace_id;
    }
    await cacheHelper().delByPattern(pattern);

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
