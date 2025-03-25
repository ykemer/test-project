import {Sequelize} from 'sequelize';

import {HealthService} from 'libs/tools';

const createHealthService = (db: Sequelize): HealthService => ({
  checkDatabase: async () => {
    try {
      await db.authenticate();
      return true;
    } catch {
      return false;
    }
  },
});

export {createHealthService};
