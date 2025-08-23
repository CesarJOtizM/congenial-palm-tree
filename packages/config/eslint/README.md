# @repo/eslint - Análisis de JavaScript/TypeScript

Linter estático para JavaScript y TypeScript que detecta errores, aplica mejores prácticas y mantiene consistencia en el código.

## 🎯 ¿Qué hace?

- **Detecta errores** antes de que lleguen a producción
- **Enforza estilo** y convenciones de código
- **Mejora calidad** aplicando mejores prácticas
- **Previene problemas** identificando anti-patrones

## ⚙️ Configuraciones Disponibles

### 1. **baseConfig** - Configuración Base

```javascript
// eslint.config.mjs
import { baseConfig } from '@repo/eslint_config';
export default baseConfig;
```

**Uso**: TypeScript/JavaScript general

### 2. **reactConfig** - Configuración React

```javascript
import { reactConfig } from '@repo/eslint_config';
export default reactConfig;
```

**Uso**: Aplicaciones React, componentes JSX/TSX

### 3. **astroConfig** - Configuración Astro

```javascript
import { astroConfig } from '@repo/eslint_config';
export default astroConfig;
```

**Uso**: Aplicaciones Astro, archivos .astro

### 4. **nextConfig** - Configuración Next.js

```javascript
import { nextConfig } from '@repo/eslint_config';
export default nextConfig;
```

**Uso**: Aplicaciones Next.js, optimizaciones específicas

## 🔧 Plugins Incluidos

- **TypeScript ESLint**: Reglas específicas para TypeScript
- **ESLint Import**: Ordenamiento y validación de importaciones
- **ESLint React**: Reglas específicas para React
- **ESLint Turbo**: Reglas para monorepos con Turbo
- **Check File**: Convenciones de nomenclatura de archivos

## 🎯 Reglas Principales

### Nomenclatura y Convenciones

```typescript
const userName = 'John'; // ✅ camelCase
const API_URL = 'https://api.com'; // ✅ UPPER_CASE
const UserComponent = () => {}; // ✅ PascalCase
const _unusedParam = 'value'; // ✅ Underscore permitido
```

### Ordenamiento de Importaciones

```typescript
// 1. Built-in modules
import path from 'path';

// 2. External packages
import React from 'react';

// 3. Internal files
import { UserService } from '@repo/core/services';

// 4. Type imports
import type { User } from './types';
```

### Control de Console.log

- **Desarrollo**: Warning por `console.log`
- **Producción**: Error por `console.log`

## 🚀 Comandos

```bash
# Ejecutar ESLint en todo el proyecto
bun run eslint

# Ejecutar ESLint con corrección automática
bun run eslint:fix

# Ejecutar ESLint en un archivo específico
npx eslint src/components/Button.tsx
```

## 📁 Convenciones de Archivos

### Nombres de Archivos

- `userProfile.tsx` ✅
- `apiService.ts` ✅
- `Button.tsx` ✅

### Nombres de Carpetas

- `user_components/` ✅
- `api_services/` ✅
- `__tests__/` ✅ (excepción)

## 🔍 Troubleshooting

### Problemas Comunes

**1. Conflictos con Prettier**

```bash
npm install --save-dev eslint-config-prettier
```

**2. Variables No Utilizadas**

```typescript
// ❌ Error: variable no utilizada
const unusedVar = 'value';

// ✅ Correcto: variable ignorada
const _unusedVar = 'value';
```

**3. Verificar configuración**

```bash
npx eslint --print-config src/index.ts
```

## 📚 Recursos

- [Documentación oficial de ESLint](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
