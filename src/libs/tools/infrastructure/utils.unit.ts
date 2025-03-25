import {getEnvironmentVariables, isArray, isNumber, isNumberString, isObject, isString, omit} from './utils';

describe('Utility Functions', () => {
  describe('getEnvironment', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = {...originalEnv};
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return values for existing environment variables', () => {
      process.env.TEST_VAR1 = 'value1';
      process.env.TEST_VAR2 = 'value2';

      expect(getEnvironmentVariables(['TEST_VAR1', 'TEST_VAR2'])).toEqual(['value1', 'value2']);
    });

    it('should throw ConfigurationError for missing environment variables', () => {
      process.env.TEST_VAR1 = 'value1';

      expect(() => getEnvironmentVariables(['TEST_VAR1', 'MISSING_VAR'])).toThrow(
        new Error('Environment variable MISSING_VAR not found')
      );
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1.5)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });

  describe('isNumberString', () => {
    it('should return true for strings containing only digits', () => {
      expect(isNumberString('123')).toBe(true);
      expect(isNumberString('0')).toBe(true);
    });

    it('should return false for strings with non-digit characters', () => {
      expect(isNumberString('123a')).toBe(false);
      expect(isNumberString('-123')).toBe(false);
      expect(isNumberString('12.34')).toBe(false);
      expect(isNumberString('')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isNumberString(123)).toBe(false);
      expect(isNumberString(null)).toBe(false);
      expect(isNumberString(undefined)).toBe(false);
      expect(isNumberString({})).toBe(false);
      expect(isNumberString([])).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array())).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
      expect(isArray(42)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(String('test'))).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(42)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({key: 'value'})).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it('should return false for null and non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });
  });

  describe('omit', () => {
    it('should return a new object without the specified keys', () => {
      const original = {a: 1, b: 2, c: 3, d: 4};
      const result = omit(original, ['b', 'd']);

      expect(result).toEqual({a: 1, c: 3});
      // Original should not be modified
      expect(original).toEqual({a: 1, b: 2, c: 3, d: 4});
    });

    it('should handle empty exclude list', () => {
      const original = {a: 1, b: 2};
      const result = omit(original, []);

      expect(result).toEqual({a: 1, b: 2});
    });

    it('should handle non-existent keys', () => {
      const original = {a: 1, b: 2};
      const result = omit(original, ['c'] as any);

      expect(result).toEqual({a: 1, b: 2});
    });
  });
});
