import dotenv from 'dotenv';
dotenv.config();

import {getConfiguredApp} from '/config/infrastructure';
import {connectRedis} from '/libs/tools';

const start = async () => {
  const app = getConfiguredApp();
  await connectRedis();

  app.listen(3000, () => {
    console.log('Auth service is listening on port 3000.');
  });
};

(async () => {
  await start();
})();
