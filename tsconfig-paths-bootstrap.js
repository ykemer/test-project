const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
  baseUrl: './src',
  paths: {
    '/libs/*': ['libs/*'],
    '/config/*': ['config/*'],
    '/apps/*': ['apps/*'],
  },
});
