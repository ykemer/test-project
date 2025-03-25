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
