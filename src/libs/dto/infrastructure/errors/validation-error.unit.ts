import {RequestValidationError} from './validation-error';
import {ValidationError} from 'express-validator';

describe('RequestValidationError', () => {
  it('should create an instance with correct properties', () => {
    const validationErrors: ValidationError[] = [
      {msg: 'Field is required', type: 'field', path: 'username', location: 'body', value: ''},
    ];

    const error = new RequestValidationError(validationErrors);

    expect(error).toBeInstanceOf(RequestValidationError);
    expect(error.statusCode).toBe(400);
    expect(error.title).toBe('Request validation error');
    expect(error.errors).toEqual(validationErrors);
    expect(error.message).toBe('Request validation error');
  });

  it('should serialize field errors correctly', () => {
    const validationErrors: ValidationError[] = [
      {msg: 'Field is required', type: 'field', path: 'username', location: 'body', value: ''},
      {msg: 'Must be a valid email', type: 'field', path: 'email', location: 'body', value: 'not-an-email'},
    ];
    const error = new RequestValidationError(validationErrors);

    const serializedErrors = error.serializeErrors();

    expect(serializedErrors).toEqual([
      {message: 'Field is required', field: 'username'},
      {message: 'Must be a valid email', field: 'email'},
    ]);
  });

  it('should serialize non-field errors correctly', () => {
    const validationErrors: ValidationError[] = [
      {msg: 'Unknown validation error', type: 'unknown', value: 'some value'},
    ];
    const error = new RequestValidationError(validationErrors);

    const serializedErrors = error.serializeErrors();

    expect(serializedErrors).toEqual([{message: 'Unknown validation error'}]);
  });
});
