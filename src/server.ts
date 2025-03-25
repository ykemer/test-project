import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import {applyAppConfiguration} from 'config/infrastructure';
import {connectRedis} from 'config/infrastructure/caching/redis-client';

const app = express();

const start = async () => {
  await connectRedis();

  app.listen(3000, () => {
    console.log('Auth service is listening on port 3000.');
  });
};

(async () => {
  applyAppConfiguration(app);
  await start();
})();
