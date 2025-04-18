﻿import {Sequelize} from 'sequelize';

import {getEnvironmentVariables} from '../utils';

const [DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST] = getEnvironmentVariables([
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
]);

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
  });
} else {
  sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
  });
}

export {sequelize};
