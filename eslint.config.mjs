import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import sortExportsPlugin from 'eslint-plugin-sort-exports';

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
    },
    rules: {
      // Disable no-unused-vars for interfaces and type definitions
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          // Ignore parameters in interfaces, type definitions, and function signatures
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          // Add special handling for type definitions
          varsIgnorePattern: '^.*Interface$',
        },
      ],
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
      'src/scripts/*',
      '*.js',
    ],
  },
];
