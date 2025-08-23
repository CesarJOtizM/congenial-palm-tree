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
      enabled: false, // Cambiado a false para evitar duplicación
      // Configuración adicional para mejor experiencia
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/*.config.*',
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
};

// Re-export specific configs for backwards compatibility
export { astroConfig } from './configs/astro.js';
export { baseConfig } from './configs/base.js';
export { reactConfig } from './configs/react.js';
