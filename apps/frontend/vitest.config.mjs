import { defineConfig, mergeConfig } from 'vitest/config';

import { reactConfig } from '@repo/config/vitest';

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      css: true,
      globals: true,
    },
  })
);
