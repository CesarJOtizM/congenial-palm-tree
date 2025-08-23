import { defineProject, mergeConfig } from 'vitest/config';

import { baseConfig } from './base.js';

// Configuración específica de coverage para Astro
const astroSpecificConfig = defineProject({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});

// Configuración de coverage específica para Astro
const astroTestConfig = mergeConfig(astroSpecificConfig, {
  test: {
    coverage: {
      include: [
        'src/**/*.{js,jsx,ts,tsx,astro}',
        'src/utils/**/*',
        'src/services/**/*',
        'src/helpers/**/*',
        'src/components/**/*',
        'src/layouts/**/*',
      ],
      exclude: [
        // Removemos la exclusión de archivos .astro
        'src/pages/**/*', // Mantenemos páginas excluidas
        'src/**/*.test.*',
        'src/**/*.spec.*',
        'src/**/__tests__/**',
      ],
      reportsDirectory: 'coverage',
      clean: true,
      cleanOnRerun: true,
      skipFull: false,
    },
  },
});

export const astroConfig = mergeConfig(baseConfig, astroTestConfig);
