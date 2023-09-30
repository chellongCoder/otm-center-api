import config from 'config';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

export const cacheHelper = () => {
  const getCacheServer = () => {
    let port = 0;
    try {
      if (process.env.REDIS_PORT) {
        port = Number(process.env.REDIS_PORT);
      } else {
        port = Number(config.get('redis.port'));
      }
    } catch (error) {
      console.log('chh_log ---> getCacheServer ---> error:', error);
    }
    const cacheServer = new Redis({
      host: process.env.REDIS_HOST || config.get('redis.host'),
      port: port,
      password: process.env.REDIS_PASSWORD || config.get('redis.password'),
      username: process.env.REDIS_USER_NAME || config.get('redis.username'),
    });

    if (!cacheServer) {
      throw new Exception(ExceptionName.CACHE_SERVER_NOT_FOUND, ExceptionCode.CACHE_SERVER_NOT_FOUND, 401);
    }

    return cacheServer;
  };

  const cacheServer = getCacheServer();
  const get = async (key: string) => {
    try {
      const cacheData = await cacheServer.get(key);
      if (!cacheData) {
        return;
      }
      return JSON.parse(cacheData).cached || null;
    } catch (e) {
      console.error(e, 'error_get_redis');
      return;
    }
  };

  const set = async (key: string, value: any, ttl?: number) => {
    try {
      if (ttl) {
        return await cacheServer.set(key, stringify({ cached: value }), 'EX', ttl);
      } else {
        return await cacheServer.set(key, stringify({ cached: value }));
      }
    } catch (e: any) {
      console.error(
        {
          stack: e.stack,
          message: e.message,
        },
        'error_set_redis',
      );
      return;
    }
  };

  const remove = async (key: string) => {
    try {
      return await cacheServer.del(key);
    } catch (e) {
      return;
    }
  };

  const incr = async (key: string, ttl: number) => {
    try {
      const count = await cacheServer.incr(key);
      await cacheServer.expire(key, ttl);
      return count;
    } catch (e) {
      return;
    }
  };

  const delByPattern = async (pattern: string) => {
    try {
      const keys = await cacheServer.keys(pattern);
      await cacheServer.del(keys);
      return true;
    } catch (e) {
      return;
    }
  };

  return {
    get,
    set,
    remove,
    incr,
    delByPattern,
    getCacheServer,
  };
};
