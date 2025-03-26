import {CachingService} from 'libs/tools';
import {userCacheKeys} from 'apps/users/common/infrastructure/caching/cache-keys';

const invalidateUserCache = async (userId: string, cachingService: CachingService): Promise<void> => {
  await cachingService.invalidate(userCacheKeys.single(userId));
  await cachingService.invalidateByPattern(userCacheKeys.listPattern());
};

export {invalidateUserCache};
