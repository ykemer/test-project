import {Sequelize} from 'sequelize';

import {getEnvironmentVariables} from 'libs/tools';

const [DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST] = getEnvironmentVariables([
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
]);

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

export {sequelize};
