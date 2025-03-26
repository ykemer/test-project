import {json} from 'body-parser';
import {Express} from 'express';

import {configureRouters} from 'config/infrastructure/configureRouters';
import {healthRouter} from 'config/infrastructure/health/health-routes';
import {swaggerRouter} from 'config/infrastructure/swagger/swagger';
import {NotFoundError} from 'libs/dto';
import {createHealthService, redisClient, sequelize} from 'libs/tools';

import {accessLogger} from './middleware/access-logger';
import {currentUser} from './middleware/current-user';
import {errorHandler} from './middleware/error-handler';
import {generateTraceId} from './middleware/generate-trace-id';
import {configureSecurity} from './security';

const applyAppConfiguration = (app: Express) => {
  app.use(json());
  configureSecurity(app);
  app.use(generateTraceId);
  app.use(accessLogger);
  app.use(currentUser);

  configureRouters(app);
  app.use(swaggerRouter);
  const healthService = createHealthService(sequelize, redisClient);
  app.use('/_health', healthRouter(healthService));
  app.all('/{*splat}', async () => {
    throw new NotFoundError('Resource not found');
  });

  app.use(errorHandler);
};

export {applyAppConfiguration};
