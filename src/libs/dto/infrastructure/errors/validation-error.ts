﻿import {ValidationError} from 'express-validator';

import {CustomError} from './custom-error';

class RequestValidationError extends CustomError {
  statusCode = 400;
  title = 'Request validation error';
  constructor(public errors: ValidationError[]) {
    super('Request validation error');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(err => {
      if (err.type === 'field') {
        return {message: err.msg, field: err.path};
      }
      return {message: err.msg};
    });
  }
}

export {RequestValidationError};
