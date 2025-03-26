import {CachingService, redisClient} from '/libs/tools';

const DEFAULT_EXPIRATION = 3600;

const cachingServiceCreator = (): CachingService => {
  return {
    getOrSet: async <T>(
      key: string,
      fetchFn: () => Promise<T>,
      expiration: number = DEFAULT_EXPIRATION
    ): Promise<T> => {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const freshData = await fetchFn();
      await redisClient.setEx(key, expiration, JSON.stringify(freshData));
      return freshData;
    },
    set: async <T>(key: string, data: T, expiration: number = DEFAULT_EXPIRATION): Promise<void> => {
      await redisClient.setEx(key, expiration, JSON.stringify(data));
    },
    invalidate: async (key: string): Promise<void> => {
      await redisClient.del(key);
    },
    invalidateByPattern: async (pattern: string): Promise<void> => {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    },
  };
};

export {cachingServiceCreator};
