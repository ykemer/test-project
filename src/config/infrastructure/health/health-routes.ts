﻿import {Router, Request, Response} from 'express';

import {HealthService} from 'libs/tools';

export const healthRouter = (healthService: HealthService): Router => {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    const dbConnected = await healthService.checkDatabase();

    res.status(dbConnected ? 200 : 500).json({
      status: dbConnected ? 'healthy' : 'unhealthy',
      database: dbConnected ? 'connected' : 'disconnected',
    });
  });

  return router;
};
