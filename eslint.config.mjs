import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import sortExportsPlugin from 'eslint-plugin-sort-exports';
import {fileURLToPath} from 'node:url';

const localRulesModule = await import('./tools/eslint/eslint-local-rules.js');
const localRules = localRulesModule.default || localRulesModule;

const compat = new FlatCompat();
export default [
  js.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      'sort-exports': sortExportsPlugin,
      'local-rules': {
        rules: localRules,
      },
    },
    rules: {
      // Disable no-unused-vars for interfaces and type definitions
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^.*Interface$',
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'import/custom-module-paths': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          alphabetize: {order: 'asc', caseInsensitive: false},
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'error',
      'local-rules/leading-slash-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*', 'libs/*', 'config/*'],
              message:
                'Imports from apps, libs, and config must start with a leading slash (e.g., "/apps/..." instead of "apps/...")',
            },
          ],
        },
      ],
      'sort-exports/sort-exports': [
        'error',
        {
          sortDir: 'asc',
          ignoreCase: true,
          sortExportKindFirst: 'type',
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  {
    ignores: [
      '**/build',
      '**/e2e',
      '**/coverage',
      '**/jest',
      '**/*.jest.config.js',
      '**/*.acceptance.ts',
      '**/*.e2e.ts',
      '**/*.integration.ts',
      '**/*.unit.ts',
      '**/eslint.config.mjs',
      '**/*.mjs',
      '**/tests/*',
      '**/*.js',
    ],
  },
];
