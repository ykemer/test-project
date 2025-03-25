import crypto from 'node:crypto';

import {Request, Response, NextFunction} from 'express';


const generateTraceId = (req: Request, _res: Response, next: NextFunction) => {
  req.traceId = crypto.randomUUID();
  next();
};

export {generateTraceId};
