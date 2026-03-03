import { userCacheKeys } from '/apps/users/common/infrastructure/caching/cache-keys';
import { CachingServiceInterface } from '/libs/tools';

const invalidateUserCache = async (userId: string, cachingService: CachingServiceInterface): Promise<void> => {
  await cachingService.invalidate(userCacheKeys.single(userId));
  await cachingService.invalidateByPattern(userCacheKeys.listPattern());
};

export {invalidateUserCache};
