import { baseConfig } from '@repo/config/eslint';

export default [
  ...baseConfig,
  {
    rules: {
      // Desactivar la convención de nombres de archivos para permitir el formato de NestJS
      'check-file/filename-naming-convention': 'off',
    },
  },
];
