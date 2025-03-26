import {Request, Response, NextFunction} from 'express';

import {NotAuthorizedError} from '/libs/dto';

const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};

export {requireAuth};
