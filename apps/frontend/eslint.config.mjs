import { reactConfig } from '@repo/config/eslint';

export default [
  ...reactConfig,
  {
    ignores: [
      '.next/**',
      '.turbo/**',
      'coverage/**',
      'node_modules/**',
      '.dist/**',
      'build/**',
    ],
  },
];
