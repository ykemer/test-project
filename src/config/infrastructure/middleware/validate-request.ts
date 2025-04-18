﻿import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';

import {RequestValidationError} from '/libs/dto';

const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};

export {validateRequest};
