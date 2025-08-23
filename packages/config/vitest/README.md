# @repo/vitest - Configuraciones de Testing

Configuraciones centralizadas de Vitest para testing en el monorepo con cobertura de código al 100%.

## 🎯 ¿Qué hace?

- **Configuraciones base** para testing con Vitest
- **Cobertura de código** al 100% obligatoria
- **Configuraciones específicas** para React, Astro y proyectos base
- **Reportes de cobertura** en múltiples formatos

## ⚙️ Configuraciones Disponibles

### 1. **baseConfig** - Configuración Base

```typescript
// vitest.config.ts
import { baseConfig } from '@repo/vitest';
export default baseConfig;
```

**Uso**: Configuración base para cualquier proyecto

### 2. **reactConfig** - Configuración React

```typescript
import { reactConfig } from '@repo/vitest';
export default reactConfig;
```

**Uso**: Aplicaciones React con testing de componentes

### 3. **astroConfig** - Configuración Astro

```typescript
import { astroConfig } from '@repo/vitest';
export default astroConfig;
```

**Uso**: Aplicaciones Astro con testing específico

## 📋 Configuración Base

```typescript
export const baseConfig = defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: [
        'text', // Porcentajes en consola
        'text-summary', // Resumen en consola
        'html', // Reporte HTML
        'json', // Para integración
      ],
      enabled: true,
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
```

## 🎯 Características Principales

### Cobertura al 100%

- **branches**: 100% - Todas las ramas de código
- **functions**: 100% - Todas las funciones
- **lines**: 100% - Todas las líneas
- **statements**: 100% - Todas las declaraciones

### Reportes de Cobertura

- **text**: Porcentajes en consola
- **text-summary**: Resumen en consola
- **html**: Reporte HTML navegable
- **json**: Para integración con herramientas

### Configuración Global

- **globals**: true - Variables globales disponibles
- **coverage.enabled**: true - Cobertura habilitada por defecto

## 🚀 Comandos

```bash
# Ejecutar tests
bun run test

# Ejecutar tests con cobertura
bun run test:coverage

# Ejecutar tests en modo watch
bun run test:watch

# Ejecutar tests específicos
bun run test src/components/Button.test.tsx

# Abrir UI de Vitest
bun run test:ui
```

## 📁 Estructura de Tests Recomendada

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts
└── __tests__/          # Tests de integración
    └── api.test.ts
```

## 🧪 Ejemplos de Tests

### Test de Componente React

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test de Utilidad

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('formats number as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-500)).toBe('-$500.00');
  });
});
```

### Test de API

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

describe('fetchUser', () => {
  it('fetches user data successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const result = await fetchUser(1);
    expect(result).toEqual(mockUser);
  });

  it('throws error on failed request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchUser(999)).rejects.toThrow('User not found');
  });
});
```

## 🔧 Configuración Avanzada

### Configuración Personalizada

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import { baseConfig } from '@repo/vitest';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    },
  })
);
```

### Setup de Tests

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de fetch global
global.fetch = vi.fn();

// Configuración de testing-library
import { configure } from '@testing-library/react';
configure({ testIdAttribute: 'data-testid' });
```

## 🔍 Troubleshooting

### Problemas Comunes

**1. Tests no encuentran módulos**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    alias: {
      '@': '/src',
      '@repo': '/packages',
    },
  },
});
```

**2. Cobertura no se genera**

```bash
# Verificar que coverage esté habilitado
bun run test:coverage --coverage.enabled=true
```

**3. Tests de componentes fallan**

```typescript
// Asegurar que jsdom esté configurado
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

## 📚 Recursos

- [Documentación oficial de Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Cobertura de Código](https://vitest.dev/guide/coverage.html)
