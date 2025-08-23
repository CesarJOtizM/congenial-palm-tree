# @repo/typescript - Configuraciones TypeScript

Configuraciones centralizadas de TypeScript para diferentes tipos de proyectos en el monorepo.

## 🎯 ¿Qué hace?

- **Configuraciones base** para TypeScript con mejores prácticas
- **Configuraciones específicas** para Next.js, React y Astro
- **Consistencia** en la configuración de tipos en todo el monorepo
- **Optimizaciones** específicas por framework

## ⚙️ Configuraciones Disponibles

### 1. **base.json** - Configuración Base

```json
{
  "extends": "@repo/typescript/base.json"
}
```

**Uso**: Configuración base para cualquier proyecto TypeScript

### 2. **nextjs.json** - Configuración Next.js

```json
{
  "extends": "@repo/typescript/nextjs.json"
}
```

**Uso**: Aplicaciones Next.js con optimizaciones específicas

### 3. **react.json** - Configuración React

```json
{
  "extends": "@repo/typescript/react.json"
}
```

**Uso**: Aplicaciones React con soporte JSX

### 4. **astro.json** - Configuración Astro

```json
{
  "extends": "@repo/typescript/astro.json"
}
```

**Uso**: Aplicaciones Astro con plugin específico

## 📋 Configuración Base

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022",
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 🎯 Características Principales

### Configuración Estricta

- **strict**: true - Habilita todas las verificaciones estrictas
- **noUncheckedIndexedAccess**: true - Acceso seguro a arrays y objetos
- **forceConsistentCasingInFileNames**: true - Consistencia en nombres de archivos

### Soporte Moderno

- **target**: "ES2022" - JavaScript moderno
- **lib**: ["es2022", "DOM", "DOM.Iterable"] - APIs modernas
- **moduleResolution**: "bundler" - Resolución optimizada para bundlers

### Optimizaciones

- **isolatedModules**: true - Compatibilidad con bundlers
- **skipLibCheck**: true - Mejor rendimiento
- **declaration**: true - Genera archivos de declaración

## 🚀 Uso por Framework

### Next.js

```json
{
  "extends": "@repo/typescript/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "jsx": "preserve",
    "incremental": true
  }
}
```

### React

```json
{
  "extends": "@repo/typescript/react.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### Astro

```json
{
  "extends": "@repo/typescript/astro.json",
  "compilerOptions": {
    "plugins": [{ "name": "@astrojs/ts-plugin" }],
    "types": ["astro/client"]
  }
}
```

## 🔧 Comandos

```bash
# Verificar tipos en todo el proyecto
bun run check-types

# Verificar tipos en un archivo específico
npx tsc --noEmit src/components/Button.tsx

# Generar archivos de declaración
npx tsc --declaration --emitDeclarationOnly
```

## 📁 Estructura Recomendada

```
src/
├── types/              # Tipos globales
│   ├── global.d.ts
│   └── api.ts
├── components/         # Componentes tipados
│   └── Button/
│       ├── Button.tsx
│       └── types.ts
└── utils/             # Utilidades tipadas
    └── helpers.ts
```

## 🎨 Mejores Prácticas

### Definición de Tipos

```typescript
// ✅ Tipos específicos
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Tipos genéricos
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// ✅ Tipos utilitarios
type UserWithoutId = Omit<User, 'id'>;
type UserPartial = Partial<User>;
```

### Configuración de Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@repo/*": ["../../packages/*"]
    }
  }
}
```

## 🔍 Troubleshooting

### Problemas Comunes

**1. Errores de tipos en node_modules**

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

**2. Conflictos de JSX**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

**3. Verificar configuración**

```bash
npx tsc --showConfig
```

## 📚 Recursos

- [Documentación oficial de TypeScript](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)
