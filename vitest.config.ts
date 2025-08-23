import { sharedConfig } from '@repo/config/vitest';
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
