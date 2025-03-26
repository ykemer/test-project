import {json} from 'body-parser';
import {Express} from 'express';

import {accessLogger} from 'config/infrastructure//middleware/access-logger';
import {currentUser} from 'config/infrastructure//middleware/current-user';
import {errorHandler} from 'config/infrastructure//middleware/error-handler';
import {healthRouter} from 'config/infrastructure/health/health-routes';
import {generateTraceId} from 'config/infrastructure/middleware';
import {configureRouters} from 'config/infrastructure/routes/configureRouters';
import {configureSecurity} from 'config/infrastructure/security/security';
import {swaggerRouter} from 'config/infrastructure/swagger/swagger';
import {NotFoundError} from 'libs/dto';
import {createHealthService, redisClient, sequelize} from 'libs/tools';

const applyAppConfiguration = (app: Express) => {
  app.set('trust proxy', true);
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
