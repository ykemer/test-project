import {Sequelize} from 'sequelize';

import {HealthService, RedisClientHealthService} from '../../domain';

const createHealthService = (db: Sequelize, redisClient: RedisClientHealthService): HealthService => ({
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
