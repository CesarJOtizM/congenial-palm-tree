import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: [['json', { file: '../coverage.json' }]],
      enabled: true,
      exclude: [
        'node_modules/**',
        'dist/**',
        'test/**',
        '**/*.e2e-spec.ts',
        '**/*.spec.ts',
      ],
    },
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    exclude: ['node_modules/**', 'dist/**'],
  },
});
