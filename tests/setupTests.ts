import dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

// Mock Redis client before any tests run
jest.mock('/libs/tools/infrastructure/services/caching/redis-client', () => {
  const mockClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    keys: jest.fn().mockResolvedValue([]),
    isOpen: true,
  };

  return {
    redisClient: mockClient,
    connectRedis: jest.fn().mockResolvedValue(undefined),
  };
});

// Mock the caching service that uses the Redis client
jest.mock('/libs/tools/infrastructure/services/caching/caching-service', () => {
  return {
    cachingServiceCreator: jest.fn().mockReturnValue({
      invalidateByPattern: jest.fn().mockResolvedValue(undefined),
      invalidate: jest.fn().mockResolvedValue(undefined),
      getOrSet: jest.fn().mockImplementation(async (_key, fetchFn) => fetchFn()),
      set: jest.fn().mockResolvedValue(undefined),
    }),
  };
});
