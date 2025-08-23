import { defineConfig } from 'vitest/config';

export const baseConfig = defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: [
        'text', // Muestra porcentajes en consola como Jest
        'text-summary', // Resumen en consola
        'html', // Reporte HTML
        'json', // Para integración con herramientas
        [
          'json',
          {
            file: `../coverage.json`,
          },
        ],
      ],
      enabled: true,
      // Configuración adicional para mejor experiencia
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      // Umbrales de cobertura al 100% - OBLIGATORIO
      thresholds: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
});
