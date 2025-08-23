export const sharedConfig = {
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul' as const,
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
      ] as const,
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
      // Umbrales de cobertura (opcional)
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
};

// Re-export specific configs for backwards compatibility
export { baseConfig } from './configs/base.js';
export { reactConfig } from './configs/react.js';
