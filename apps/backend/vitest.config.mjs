import { resolve } from 'path';

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, mergeConfig } from 'vitest/config';

import { baseConfig } from '@repo/config/vitest';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      environment: 'node',
      include: [
        'src/**/*.{test,spec}.{js,ts}',
        'test/**/*.{test,spec}.{js,ts}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      coverage: {
        enabled: true,
        include: ['src/**/*'],
        exclude: [
          'src/**/*.test.*',
          'src/**/*.spec.*',
          'src/**/__tests__/**',
          'src/**/index.ts', // archivos de exportación
          'src/__tests__/**', // archivos de configuración de pruebas
          '**/*.d.ts', // archivos de declaración
          '**/*.config.*', // archivos de configuración
          '**/mocks/**', // archivos de mocks
          '**/*.mock.*', // archivos de mocks
        ],
        reportsDirectory: 'coverage',
        // Configuración específica para el paquete core
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
          },
        },
      },
      // Configuración para mejor rendimiento y debugging
      isolate: true,
      pool: 'threads',
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
      // Configuración para timeouts
      testTimeout: 10000,
      hookTimeout: 10000,
      // Configuración para mejor reporting
      reporters: ['verbose'],
      // Configuración para setup y teardown
      setupFiles: [],
      globalSetup: [],
      // Configuración para mocks
      mockReset: true,
      restoreMocks: true,
      clearMocks: true,
    },
    // Configuración de resolución de módulos
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@app': resolve(__dirname, './src'),
        '@modules': resolve(__dirname, './src'),
        '@common': resolve(__dirname, './src/common'),
        '@config': resolve(__dirname, './src/config'),
        '@database': resolve(__dirname, './src/database'),
        '@cache': resolve(__dirname, './src/cache'),
        '@auth': resolve(__dirname, './src/auth'),
        '@users': resolve(__dirname, './src/users'),
        '@debts': resolve(__dirname, './src/debts'),
        '@decorators': resolve(__dirname, './src/common/decorators'),
        '@dto': resolve(__dirname, './src/common/dto'),
        '@filters': resolve(__dirname, './src/common/filters'),
        '@interfaces': resolve(__dirname, './src/common/interfaces'),
        '@test': resolve(__dirname, './test'),
      },
    },
    // Configuración para TypeScript
    esbuild: {
      target: 'node18',
    },
  })
);
