import {createRetryDecorator} from './retry-decorator';
import {BadRequestError} from 'libs/dto';

describe('createRetryDecorator', () => {
  it('should return the result if function succeeds on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const decoratedFn = createRetryDecorator(mockFn);
    const result = decoratedFn();

    await expect(result).resolves.toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('Attempt 1 failed'))
      .mockRejectedValueOnce(new Error('Attempt 2 failed'))
      .mockResolvedValue('success');

    const decoratedFn = createRetryDecorator(mockFn, {baseDelay: 1});
    const resultPromise = decoratedFn();

    await expect(resultPromise).resolves.toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should throw BadRequestError immediately without retrying', async () => {
    const badRequestError = new BadRequestError('Invalid input');
    const mockFn = jest.fn().mockRejectedValue(badRequestError);

    const decoratedFn = createRetryDecorator(mockFn);
    const resultPromise = decoratedFn();

    await expect(resultPromise).rejects.toThrow(badRequestError);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should throw the last error after max retries', async () => {
    const mockError = new Error('Operation failed');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    const decoratedFn = createRetryDecorator(mockFn, {maxRetries: 2, baseDelay: 1});
    const resultPromise = decoratedFn();

    await expect(resultPromise).rejects.toThrow(mockError);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should respect custom maxRetries option', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Failed'));

    const decoratedFn = createRetryDecorator(mockFn, {maxRetries: 2, baseDelay: 1});
    const resultPromise = decoratedFn();

    await expect(resultPromise).rejects.toThrow('Failed');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
