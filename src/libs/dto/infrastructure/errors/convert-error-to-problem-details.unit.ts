import {convertErrorToProblemDetails} from './convert-error-to-problem-details';
import {BadRequestError} from '/libs/dto';
import {Request} from 'express';

describe('convertErrorToProblemDetails', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      protocol: 'http',
      get: jest.fn().mockReturnValue('test.com'),
      traceId: 'test-trace-id',
    };
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
});
