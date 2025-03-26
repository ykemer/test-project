const userCacheKeys = {
  single: (userId: string): string => `users:single:${userId}`,
  list: (page: number, pageSize: number): string => `users:list:page=${page}:pageSize=${pageSize}`,
  listPattern: (): string => 'users:list:*',
};

export {userCacheKeys};
