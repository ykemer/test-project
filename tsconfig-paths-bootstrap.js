const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
  baseUrl: './src',
  paths: {
    'libs/*': ['libs/*'],
    '/libs/*': ['libs/*'],
    'apps/*': ['apps/*'],
    '/apps/*': ['apps/*'],
  },
});

tsConfigPaths.register({
  baseUrl: './build', // Changed from './src' to point to the compiled output
  paths: {
    'config/*': ['config/*'], // Added this based on your error
    'libs/*': ['libs/*'],
    '/libs/*': ['libs/*'],
    'apps/*': ['apps/*'],
    '/apps/*': ['apps/*'],
  },
});
