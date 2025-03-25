import {BadRequestError} from 'libs/dto';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

const createRetryDecorator = <T>(fn: () => Promise<T>, options: RetryOptions = {}) => {
  const {maxRetries = 3, baseDelay = 100} = options;

  return async (): Promise<T> => {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (error instanceof BadRequestError) {
          throw error;
        }

        attempts++;

        if (attempts < maxRetries) {
          const delay = Math.pow(2, attempts) * baseDelay;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed after retry attempts');
  };
};

export {createRetryDecorator};
