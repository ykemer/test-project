import {convertErrorToProblemDetails} from './convert-error-to-problem-details';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotAuthorizedError,
  NotFoundError,
  RateLimitError,
} from '/libs/dto';
import {Request} from 'express';

describe('convertErrorToProblemDetails', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      protocol: 'http',
      get: jest.fn().mockReturnValue('test.com'),
      traceId: 'test-trace-id',
    } as unknown as Partial<Request>;
  });

  it('should convert CustomError to problem details format', () => {
    // Arrange
    const customError = new BadRequestError('Validation error message');
    const statusCode = 400;

    // Act
    const result = convertErrorToProblemDetails(customError, statusCode, mockRequest as Request);

    // Assert
    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400',
      title: 'Bad Request',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Validation error message',
      errors: [{message: 'Validation error message'}],
    });
  });

  it('should handle CustomError with multiple errors', () => {
    const customError = new BadRequestError('Multiple errors');
    customError.serializeErrors = jest.fn().mockReturnValue([{message: 'Error 1'}, {message: 'Error 2'}]);
    const statusCode = 400;

    const result = convertErrorToProblemDetails(customError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400',
      title: 'Bad Request',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Error 1',
      errors: [{message: 'Error 1'}, {message: 'Error 2'}],
    });
  });

  it('should handle CustomError with empty errors array', () => {
    const customError = new BadRequestError('No errors');
    customError.serializeErrors = jest.fn().mockReturnValue([]);
    const statusCode = 400;

    const result = convertErrorToProblemDetails(customError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400',
      title: 'Bad Request',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Validation failed',
      errors: [],
    });
  });

  it('should convert regular Error to generic problem details', () => {
    const regularError = new Error('Something broke');
    const statusCode = 500;

    const result = convertErrorToProblemDetails(regularError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'http://test.com/problems/server-error',
      title: 'Server Error',
      status: statusCode,
      detail: 'Something went wrong',
    });
  });

  it('should convert ConflictError to problem details format', () => {
    const conflictError = new ConflictError('Resource already exists');
    const statusCode = 409;

    const result = convertErrorToProblemDetails(conflictError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409',
      title: 'Resource already exists',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Resource already exists',
      errors: [{message: 'Resource already exists'}],
    });
  });

  it('should convert ForbiddenError to problem details format', () => {
    const forbiddenError = new ForbiddenError();
    const statusCode = 403;

    const result = convertErrorToProblemDetails(forbiddenError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403',
      title: 'Forbidden',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Forbidden',
      errors: [{message: 'Forbidden'}],
    });
  });

  it('should convert NotAuthorizedError to problem details format', () => {
    const notAuthorizedError = new NotAuthorizedError();
    const statusCode = 401;

    const result = convertErrorToProblemDetails(notAuthorizedError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401',
      title: 'Not authorized',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Not authorized',
      errors: [{message: 'Not authorized'}],
    });
  });

  it('should convert NotFoundError to problem details format', () => {
    const notFoundError = new NotFoundError('User not found');
    const statusCode = 404;

    const result = convertErrorToProblemDetails(notFoundError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404',
      title: 'Not found',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'User not found',
      errors: [{message: 'User not found'}],
    });
  });

  it('should convert RateLimitError to problem details format', () => {
    const rateLimitError = new RateLimitError();
    const statusCode = 429;

    const result = convertErrorToProblemDetails(rateLimitError, statusCode, mockRequest as Request);

    expect(result).toEqual({
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429',
      title: 'Too Many Requests',
      status: statusCode,
      traceId: 'test-trace-id',
      detail: 'Too Many Requests',
      errors: [{message: 'Too Many Requests'}],
    });
  });
});
