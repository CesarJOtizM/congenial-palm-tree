# ESLint - Análisis de JavaScript/TypeScript

## 🎯 ¿Qué es ESLint?

ESLint es un linter estático para JavaScript y TypeScript que analiza tu código para encontrar problemas potenciales, errores y violaciones de estilo. En nuestro proyecto, ESLint es la herramienta principal para mantener la calidad del código.

### Propósito Principal

- **🔍 Detectar errores**: Encuentra bugs y problemas antes de que lleguen a producción
- **📏 Enforzar estilo**: Asegura que todo el código siga las mismas convenciones
- **🚀 Mejorar calidad**: Aplica mejores prácticas y patrones recomendados
- **🛡️ Prevenir problemas**: Identifica anti-patrones y código problemático

## ⚙️ Configuración Actual

### Versión

- **ESLint**: 9.30.0 (Flat Config)
- **TypeScript ESLint**: 8.35.0
- **Configuración**: Flat Config (nueva arquitectura de ESLint 9.x)

### Estructura de Configuración

```
packages/eslint_config/
├── index.js          # Exporta todas las configuraciones
├── base.js           # Configuración base para JS/TS
├── react.js          # Configuración específica para React
├── astro.js          # Configuración específica para Astro
└── next.js           # Configuración específica para Next.js
```

### Configuraciones Disponibles

#### 1. **baseConfig** - Configuración Base

```javascript
// eslint.config.mjs
import { baseConfig } from '@repo/eslint_config';
export default baseConfig;
```

**Uso**: TypeScript/JavaScript general, aplicaciones vanilla

#### 2. **reactConfig** - Configuración React

```javascript
// eslint.config.mjs
import { reactConfig } from '@repo/eslint_config';
export default reactConfig;
```

**Uso**: Aplicaciones React, componentes JSX/TSX

#### 3. **astroConfig** - Configuración Astro

```javascript
// eslint.config.mjs
import { astroConfig } from '@repo/eslint_config';
export default astroConfig;
```

**Uso**: Aplicaciones Astro, archivos .astro

#### 4. **nextConfig** - Configuración Next.js

```javascript
// eslint.config.mjs
import { nextConfig } from '@repo/eslint_config';
export default nextConfig;
```

**Uso**: Aplicaciones Next.js, optimizaciones específicas

## 📋 Reglas y Configuraciones

### 🔧 Plugins Incluidos

#### TypeScript ESLint

- **Propósito**: Reglas específicas para TypeScript
- **Reglas clave**:
  - `@typescript-eslint/no-unused-vars`: Variables no utilizadas
  - `@typescript-eslint/no-explicit-any`: Prohibir uso de `any`
  - `@typescript-eslint/naming-convention`: Convenciones de nomenclatura

#### ESLint Import

- **Propósito**: Ordenamiento y validación de importaciones
- **Reglas clave**:
  - `import/order`: Ordenamiento automático de imports
  - `import/no-unresolved`: Verificar que las importaciones existan

#### ESLint React

- **Propósito**: Reglas específicas para React
- **Reglas clave**:
  - `react-hooks/rules-of-hooks`: Reglas de hooks
  - `react/jsx-key`: Keys en listas JSX

#### ESLint Turbo

- **Propósito**: Reglas para monorepos con Turbo
- **Reglas clave**:
  - `turbo/no-undeclared-env-vars`: Variables de entorno no declaradas

#### Check File

- **Propósito**: Convenciones de nomenclatura de archivos
- **Reglas clave**:
  - `check-file/folder-naming-convention`: Nombres de carpetas
  - `check-file/filename-naming-convention`: Nombres de archivos

### 🎯 Reglas Principales

#### Nomenclatura y Convenciones

```javascript
// Convenciones de nomenclatura
'@typescript-eslint/naming-convention': [
  'error',
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
    leadingUnderscore: 'allow',
    trailingUnderscore: 'allow',
  },
  {
    selector: 'function',
    format: ['camelCase', 'PascalCase'],
  },
  {
    selector: 'parameter',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
]
```

**Ejemplos válidos**:

```typescript
const userName = 'John'; // ✅ camelCase
const API_URL = 'https://api.com'; // ✅ UPPER_CASE
const UserComponent = () => {}; // ✅ PascalCase
const _unusedParam = 'value'; // ✅ Underscore permitido
```

#### Ordenamiento de Importaciones

```javascript
'import/order': [
  'error',
  {
    groups: [
      'builtin',    // Node.js built-in
      'external',   // Paquetes npm
      'internal',   // Archivos internos
      'parent',     // Directorio padre
      'sibling',    // Mismo directorio
      'index',      // Archivo index
      'object',     // Importaciones de objetos
      'type',       // Importaciones de tipos
    ],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
]
```

**Ejemplo de importaciones ordenadas**:

```typescript
// 1. Built-in modules
import path from 'path';

// 2. External packages
import React from 'react';
import { useState } from 'react';

// 3. Internal files
import { UserService } from '@repo/core/services';
import { Button } from '@/components/ui';

// 4. Parent directory
import { utils } from '../utils';

// 5. Same directory
import { constants } from './constants';

// 6. Index file
import { types } from './';

// 7. Type imports
import type { User } from './types';
```

#### Control de Console.log

```javascript
// En producción: error, en desarrollo: warning
'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
```

**Comportamiento**:

- **Desarrollo**: Warning por `console.log`
- **Producción**: Error por `console.log`
- **Solución**: Usar logger configurado o eliminar logs

#### Variables No Utilizadas

```javascript
'@typescript-eslint/no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  },
],
'no-unused-vars': 'off', // Desactivar regla base
```

**Ejemplos**:

```typescript
// ❌ Error: variable no utilizada
const unusedVar = 'value';

// ✅ Correcto: variable ignorada
const _unusedVar = 'value';

// ✅ Correcto: parámetro ignorado
function handleClick(_event) {
  // ...
}
```

#### Prohibición de Any

```javascript
'@typescript-eslint/no-explicit-any': 'error',
```

**Ejemplos**:

```typescript
// ❌ Error: uso de any
const data: any = fetchData();

// ✅ Correcto: tipo específico
const data: UserData = fetchData();

// ✅ Correcto: tipo genérico
const data: unknown = fetchData();
```

### 📁 Convenciones de Archivos

#### Nombres de Archivos

```javascript
'check-file/filename-naming-convention': [
  'error',
  {
    '**/!(vitest.config|vite.config|next.config|astro.config|tailwind.config|postcss.config|eslint.config|.stylelintrc).{js,ts}': 'CAMEL_CASE',
    '**/*.{jsx,tsx,astro}': 'CAMEL_CASE',
  },
]
```

**Ejemplos válidos**:

- `userProfile.tsx` ✅
- `apiService.ts` ✅
- `Button.tsx` ✅
- `index.ts` ✅

#### Nombres de Carpetas

```javascript
'check-file/folder-naming-convention': [
  'error',
  {
    '**/!(__tests__)/!(__mocks__)/': 'SNAKE_CASE',
  },
]
```

**Ejemplos válidos**:

- `user_components/` ✅
- `api_services/` ✅
- `__tests__/` ✅ (excepción)
- `__mocks__/` ✅ (excepción)

## 🚀 Uso y Comandos

### Comandos Principales

```bash
# Ejecutar ESLint en todo el proyecto
bun run eslint

# Ejecutar ESLint con corrección automática
bun run eslint:fix

# Ejecutar ESLint en un archivo específico
npx eslint src/components/Button.tsx

# Ejecutar ESLint con debug
npx eslint --debug src/
```

### Integración con VS Code

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

### Configuración de Archivos Ignorados

```javascript
ignores: [
  'dist/**',
  'node_modules/**',
  'build/**',
  'coverage/**',
  'public/**',
  '**/__tests__/**',
  '**/__mocks__/**',
  '**/vitest.config.{js,ts}',
  '**/vite.config.{js,ts}',
  '**/next.config.{js,ts}',
  '**/astro.config.{js,ts}',
  '**/tailwind.config.{js,ts}',
  '**/postcss.config.{js,ts}',
  '**/eslint.config.{js,ts}',
  '**/.stylelintrc.{js,ts}',
];
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Conflictos con Prettier

**Síntoma**: ESLint y Prettier se pelean por el formato
**Solución**: Verificar que `eslint-config-prettier` esté incluido

#### 2. Variables No Utilizadas

**Síntoma**: Error en variables que sí se usan
**Solución**: Verificar que no empiecen con `_` si se usan

#### 3. Importaciones No Resueltas

**Síntoma**: Error en importaciones válidas
**Solución**: Verificar configuración de paths en `tsconfig.json`

### Comandos de Diagnóstico

```bash
# Ver configuración aplicada
npx eslint --print-config src/index.ts

# Ver reglas activas
npx eslint --print-config src/index.ts | grep -A 10 "rules"

# Debug de configuración
npx eslint --debug src/
```

## 📚 Recursos Adicionales

- [Documentación oficial de ESLint](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Reglas recomendadas](https://eslint.org/docs/latest/rules/)
