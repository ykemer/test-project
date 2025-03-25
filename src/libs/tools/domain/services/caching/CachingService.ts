type CachingService = {
  getOrSet: <T>(key: string, fetchFn: () => Promise<T>, expiration?: number) => Promise<T>;
  set: <T>(key: string, data: T, expiration?: number) => Promise<void>;
  invalidate: (key: string) => Promise<void>;
  invalidateByPattern: (pattern: string) => Promise<void>;
};

export type {CachingService};
