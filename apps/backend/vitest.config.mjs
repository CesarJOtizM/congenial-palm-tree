import { defineConfig } from 'vitest/config';

import { baseConfig } from '@repo/config/vitest';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      ...baseConfig.test.coverage,
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
