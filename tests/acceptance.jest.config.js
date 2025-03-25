module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.acceptance.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['**/usecases/**/*.ts'],
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'tests/coverage/acceptance',
  rootDir: '../',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/tests/setupTests.ts'],
  moduleNameMapper: {
    '^/libs/(.*)$': '<rootDir>/src/libs/$1',
    '^libs/(.*)$': '<rootDir>/src/libs/$1',
    '^/apps/(.*)$': '<rootDir>/src/apps/$1',
    '^apps/(.*)$': '<rootDir>/src/apps/$1',
    '^/config/(.*)$': '<rootDir>/src/config/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
