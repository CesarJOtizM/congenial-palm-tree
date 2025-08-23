import { defineProject, mergeConfig } from 'vitest/config';

import { baseConfig } from './base.js';

export const reactConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      globals: true,
      css: true,
      // Configuración específica para React Testing Library
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
    },
  })
);
