import {Request, Response, NextFunction} from 'express';

import {convertErrorToProblemDetails, CustomError} from 'libs/dto';
import {getLogger} from 'libs/tools';

const logger = getLogger();

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 503;

  if (err instanceof CustomError) {
    logger.warn({
      message: err.message,
      stack: err.stack,
      traceId: req.traceId,
    });
  } else {
    logger.error({
      message: err.message,
      stack: err.stack,
      traceId: req.traceId,
    });
  }

  res.setHeader('Content-Type', 'application/problem+json');
  res.status(statusCode).send(convertErrorToProblemDetails(err, statusCode, req));
};

export {errorHandler};
