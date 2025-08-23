import { sharedConfig } from '@repo/vitest_config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...sharedConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: [['json', { file: '../coverage.json' }]],
      enabled: true,
    },
  },
});
