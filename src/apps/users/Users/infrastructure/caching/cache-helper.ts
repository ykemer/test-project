import {userCacheKeys} from 'apps/users/Users/infrastructure/caching/cache-keys';
import {CachingService} from 'libs/tools';

const invalidateUserCache = async (userId: string, cachingService: CachingService): Promise<void> => {
  await cachingService.invalidate(userCacheKeys.single(userId));
  await cachingService.invalidateByPattern(userCacheKeys.listPattern());
};

export {invalidateUserCache};
