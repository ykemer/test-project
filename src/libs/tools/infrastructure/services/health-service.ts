import { Sequelize } from 'sequelize';

import { HealthServiceInterface, RedisHealthServiceInterface } from '../../domain';

const createHealthService = (db: Sequelize, redisClient: RedisHealthServiceInterface): HealthServiceInterface => ({
  checkDatabase: async () => {
    try {
      await db.authenticate();
      return true;
    } catch {
      return false;
    }
  },
  checkCache: async () => {
    try {
      await redisClient.ping();
      return true;
    } catch {
      return false;
    }
  },
});

export {createHealthService};
