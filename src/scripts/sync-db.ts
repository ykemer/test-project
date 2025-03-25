import dotenv from 'dotenv';
dotenv.config({path: '.env'});
import {sequelize} from 'config/infrastructure/db/sequelize';
import '../config/infrastructure/db/user';

const syncDatabase = async () => {
  
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: This will sync database tables with current models.');
  console.warn('\x1b[33m%s\x1b[0m', 'This should only be used in development/test environments!');

  try {
    await sequelize.sync();
    console.log('\x1b[32m%s\x1b[0m', 'Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Database sync failed:', error);
    process.exit(1);
  }
};

syncDatabase().then();
