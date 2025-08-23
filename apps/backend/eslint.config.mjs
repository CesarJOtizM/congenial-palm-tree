// @ts-check
import { baseConfig } from '@repo/config/eslint';

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        // Agregar globals específicos de Node.js y NestJS
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // Reglas específicas para el backend
      '@typescript-eslint/no-explicit-any': 'off',
      // Permitir console.log en desarrollo para el backend
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Desactivar la convención de nombres de archivos para el backend ya que NestJS usa un formato específico
      'check-file/filename-naming-convention': 'off',
    },
  },
];
