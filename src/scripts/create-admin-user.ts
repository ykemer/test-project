import dotenv from 'dotenv';
dotenv.config({path: '.env'});
import {UserModel} from '../config/infrastructure/db/user';
import {getEnvironmentVariables, passwordServiceCreator} from '../libs/tools';

const createAdminUser = async () => {
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: This will create admin user in the database!');
  console.warn('\x1b[33m%s\x1b[0m', 'This should only be used in development/test environments!');

  const [ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME] = getEnvironmentVariables([
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'ADMIN_NAME',
  ]);
  const passwordService = passwordServiceCreator();
  const hashedPassword = await passwordService.encode(ADMIN_PASSWORD);
  try {
    await UserModel.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      name: ADMIN_NAME,
    });
    console.log('\x1b[32m%s\x1b[0m', 'Admin user created');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to create admin user:', error);
    process.exit(1);
  }
};

createAdminUser().then();
