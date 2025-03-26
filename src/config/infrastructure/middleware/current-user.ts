﻿import {Request, Response, NextFunction} from 'express';

import {jwtServiceCreator} from '/libs/tools';

const jwtTokenService = jwtServiceCreator();
const currentUser = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    next();
    return;
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = jwtTokenService.getPayload(token);
    if (payload) {
      req.currentUser = payload;
    }
  } finally {
    next();
  }
};

export {currentUser};
