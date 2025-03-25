import {Request, Response, NextFunction} from 'express';

import {ForbiddenError, NotAuthorizedError, UserRole} from 'libs/dto';

const requireRole = (roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  if (!roles.includes(req.currentUser.role)) {
    throw new ForbiddenError();
  }

  next();
};

export {requireRole};
