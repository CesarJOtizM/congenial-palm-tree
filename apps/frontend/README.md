# 🌐 Frontend - Gestión de Deudas entre Amigos

Frontend desarrollado en **Next.js 15 + React 19 + TypeScript** para la aplicación de gestión de deudas entre amigos, construido como parte de un monorepo con paquetes compartidos.

## 🏗️ Arquitectura del Monorepo

### Estructura General

```
congenial-palm-tree/
├── apps/
│   └── frontend/           # 🎯 Esta aplicación
├── packages/
│   ├── config/            # ⚙️ Configuraciones compartidas
│   │   ├── env/          # 🌍 Variables de entorno
│   │   ├── typescript/   # 📝 Configuración TS
│   │   ├── eslint/       # 🔍 Linting
│   │   ├── prettier/     # ✨ Formateo de código
│   │   ├── stylelint/    # 🎨 Linting de CSS
│   │   └── vitest/       # 🧪 Configuración de tests
│   └── database/         # 🗄️ Cliente Prisma + esquemas
└── turbo.json            # 🚀 Configuración del monorepo
```

### Paquetes Principales

#### 📦 `@repo/config` - Configuraciones Centralizadas

- **Ubicación**: `packages/config/`
- **Función**: Configuraciones compartidas para todo el monorepo
- **Módulos**:
  - `env/`: Gestión de variables de entorno
  - `typescript/`: Configuración de TypeScript
  - `eslint/`: Reglas de linting para React
  - `prettier/`: Formateo de código
  - `stylelint/`: Linting de CSS con Tailwind
  - `vitest/`: Configuraciones de testing

#### 📦 `@repo/database` - Base de Datos

- **Ubicación**: `packages/database/`
- **Función**: Cliente Prisma preconfigurado con modelos de datos
- **Características**:
  - Cliente Prisma generado automáticamente
  - Modelos para User, Debt, DomainEvent, AuditLog
  - Tipos TypeScript compartidos entre frontend y backend

## 📋 Prerrequisitos

- **Node.js**: 18+ (recomendado 20+)
- **Bun**: 1.0+ (recomendado) o npm 9+
- **Docker**: Para servicios de base de datos (opcional)
- **Backend**: API NestJS ejecutándose en puerto 8080

## 🚀 Instalación y Configuración

### 1. Instalar dependencias del monorepo

```bash
# Desde la raíz del monorepo
bun install

# O si prefieres npm
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp ../../example.env .env.local

# Editar variables según tu entorno
nano .env.local
```

**Variables requeridas:**

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080

# Configuración de Next.js
NODE_ENV=development
```

### 3. Verificar que el backend esté ejecutándose

```bash
# Verificar que el backend esté disponible
curl http://localhost:8080/health

# O usar el script de Docker
cd ../..
./test-docker.sh
```

## 🏃‍♂️ Comandos de Desarrollo

### Comandos Principales

```bash
# Desarrollo con hot reload
bun run dev

# Compilar para producción
bun run build

# Ejecutar en producción
bun run start

# Ejecutar pruebas
bun run test

# Verificar tipos
bun run check-types

# Linting y formateo
bun run lint
bun run prettier
bun run stylelint
```

### Comandos de Testing

```bash
# Ejecutar tests con cobertura
bun run test:coverage

# Tests en modo watch
bun run test:watch

# Tests específicos
bun run test src/components/auth/LoginForm.test.tsx

# UI de Vitest
bun run test:ui
```

## 📁 Estructura del Proyecto

```
src/
├── app/                     # 📱 Páginas de la aplicación (App Router)
│   ├── auth/               # 🔐 Página de autenticación
│   ├── dashboard/          # 📊 Página del dashboard
│   ├── layout.tsx          # 🎨 Layout principal
│   └── page.tsx            # 🏠 Página de inicio
├── components/              # 🧩 Componentes React
│   ├── auth/               # 🔐 Componentes de autenticación
│   │   ├── AuthGuard.tsx   # Guard de autenticación
│   │   ├── LoginForm.tsx   # Formulario de login
│   │   └── RegisterForm.tsx # Formulario de registro
│   ├── common/              # 🔧 Componentes comunes
│   │   ├── DeleteConfirmation.tsx # Modal de confirmación
│   │   ├── LoadingStates.tsx      # Estados de carga
│   │   └── SearchBar.tsx           # Barra de búsqueda
│   ├── dashboard/           # 📊 Componentes del dashboard
│   │   └── Dashboard.tsx    # Dashboard principal
│   ├── debts/               # 💰 Componentes de deudas
│   │   ├── DebtForm.tsx     # Formulario de deuda
│   │   └── DebtsList.tsx    # Lista de deudas
│   └── layout/              # 🎨 Componentes de layout
│       ├── ConditionalNavigation.tsx # Navegación condicional
│       └── Navigation.tsx            # Barra de navegación
├── contexts/                # 🌐 Contextos de React
│   ├── AuthContext.tsx      # Contexto de autenticación
│   └── NotificationContext.tsx # Contexto de notificaciones
├── lib/                     # 📚 Utilidades
│   └── utils.ts             # Funciones utilitarias
├── services/                # 🔌 Servicios de API
│   └── api.ts               # Cliente de API
├── styles/                  # 🎨 Estilos CSS
│   └── globals.css          # Estilos globales
└── types/                   # 📝 Tipos TypeScript
    └── index.ts             # Definiciones de tipos
```

## 🔧 Configuración de Paquetes

### Configuración de TypeScript

```typescript
// tsconfig.json
{
  "extends": "@repo/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@contexts/*": ["./src/contexts/*"],
      "@lib/*": ["./src/lib/*"],
      "@services/*": ["./src/services/*"],
      "@styles/*": ["./src/styles/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

### Configuración de ESLint

```typescript
// eslint.config.mjs
import { reactConfig } from '@repo/config/eslint';

export default [
  ...reactConfig,
  {
    ignores: [
      '.next/**',
      '.turbo/**',
      'coverage/**',
      'node_modules/**',
      '.dist/**',
      'build/**',
    ],
  },
];
```

### Configuración de Tailwind CSS

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados
      },
    },
  },
  plugins: [],
};

export default config;
```

## 🧪 Testing

### Cobertura Obligatoria

- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%
- **Statements**: 100%

### Ejecutar Tests

```bash
# Tests unitarios
bun run test

# Tests con cobertura
bun run test:coverage

# Tests específicos
bun run test src/components/
bun run test src/contexts/

# Tests en modo watch
bun run test:watch
```

### Configuración de Vitest

```typescript
// vitest.config.mjs
import { reactConfig } from '@repo/vitest';

export default reactConfig;
```

## 🎨 Características de la UI

### 🎯 **Diseño Responsivo**

- Optimizado para móviles y desktop
- Breakpoints adaptativos con Tailwind CSS
- Layout flexible y escalable

### 🌈 **Tema y Estilos**

- Tema claro y moderno
- Paleta de colores consistente
- Componentes reutilizables
- Iconos de Lucide React

### ♿ **Accesibilidad**

- Navegación por teclado
- Lectores de pantalla
- ARIA labels apropiados
- Contraste de colores optimizado

### 📱 **Estados de Carga**

- Skeleton loaders
- Spinners animados
- Estados de error elegantes
- Feedback visual inmediato

## 🔐 Autenticación y Seguridad

### 🛡️ **Sistema de Autenticación**

- JWT tokens con refresh automático
- Guard de autenticación en rutas
- Contexto de usuario global
- Logout automático en expiración

### 🔒 **Protección de Rutas**

- Rutas protegidas automáticamente
- Redirección inteligente
- Persistencia de sesión
- Validación de permisos

## 📊 Funcionalidades Principales

### 🏠 **Dashboard**

- Resumen de deudas en tiempo real
- Estadísticas visuales
- Acceso rápido a funciones
- Notificaciones del sistema

### 💰 **Gestión de Deudas**

- Crear, editar y eliminar deudas
- Filtros avanzados de búsqueda
- Paginación inteligente
- Estados de prioridad y vencimiento

### 👥 **Gestión de Usuarios**

- Registro e inicio de sesión
- Perfiles de usuario
- Gestión de contactos
- Historial de actividades

### 📈 **Reportes y Exportación**

- Exportar deudas en múltiples formatos
- Estadísticas detalladas
- Filtros personalizables
- Datos en tiempo real

## 🔌 Integración con Backend

### 🌐 **API Service**

- Cliente HTTP con Axios
- Interceptores automáticos
- Manejo de errores centralizado
- Refresh token automático

### 📡 **Endpoints Principales**

- `/auth/*` - Autenticación
- `/users/*` - Gestión de usuarios
- `/debts/*` - Gestión de deudas
- `/dashboard/*` - Estadísticas

### 🔄 **Sincronización**

- Estado global con React Context
- Actualizaciones en tiempo real
- Cache inteligente
- Optimistic updates

## 🐳 Docker

### 🏗️ **Construcción de Imagen**

```dockerfile
# Dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/
RUN bun install
COPY . .
EXPOSE 3000
CMD ["bun", "run", "--cwd", "apps/frontend", "dev"]
```

### 🚀 **Ejecución con Docker Compose**

```yaml
# docker-compose.yml
frontend:
  build:
    context: .
    dockerfile: apps/frontend/Dockerfile
  ports:
    - '3000:3000'
  environment:
    - NEXT_PUBLIC_API_URL=http://localhost:8080
  volumes:
    - ./apps/frontend/src:/app/apps/frontend/src:ro
```

## 🚀 Despliegue

### 🧪 **Desarrollo Local**

```bash
# Con hot reload
bun run dev

# Con Docker
docker compose --profile dev up -d
```

### 🌍 **Staging**

```bash
# Construir para staging
bun run build
bun run start

# Variables de entorno
NEXT_PUBLIC_API_URL=https://staging-api.tudominio.com
```

### 🚀 **Producción**

```bash
# Construir para producción
NODE_ENV=production bun run build

# Servir archivos estáticos
bun run start

# O usar Vercel
vercel --prod
```

## 🐛 Solución de Problemas

### Problemas con `@repo/config`

#### Error: "Cannot find module '@repo/config'"

```bash
# Solución: Reconstruir el paquete
cd packages/config
bun run build
cd ../../apps/frontend
```

#### Error: "ESLint configuration not found"

```bash
# Verificar configuración
cat eslint.config.mjs

# Reconstruir paquete eslint
cd packages/config/eslint
bun run build
cd ../../../apps/frontend
```

### Problemas con Next.js

#### Error: "Module not found"

```bash
# Limpiar cache
rm -rf .next/
rm -rf node_modules/.cache/

# Reinstalar dependencias
bun install

# Verificar alias de TypeScript
cat tsconfig.json | grep paths
```

#### Error: "Build failed"

```bash
# Verificar tipos
bun run check-types

# Limpiar build anterior
rm -rf .next/
rm -rf dist/

# Reconstruir
bun run build
```

### Problemas de API

#### Error: "API connection failed"

```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8080/health

# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL

# Verificar configuración
cat src/config/env.config.ts
```

#### Error: "Authentication failed"

```bash
# Verificar tokens en localStorage
localStorage.getItem('accessToken')

# Verificar configuración de JWT
cat src/contexts/AuthContext.tsx

# Limpiar sesión
localStorage.clear()
```

## 🔄 Flujo de Desarrollo

### 1. Iniciar Servicios

```bash
# Backend (si usas Docker)
cd ../..
docker compose --profile dev up -d

# O localmente
cd ../backend
bun run start:dev
```

### 2. Configurar Entorno

```bash
# Copiar y configurar variables
cp ../../example.env .env.local

# Editar variables según tu setup
nano .env.local
```

### 3. Ejecutar Frontend

```bash
# Desarrollo
bun run dev

# O producción
bun run build
bun run start
```

### 4. Verificar Funcionamiento

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:8080/health

# API
curl http://localhost:8080/api/health
```

## 📊 Estado del Proyecto

- ✅ **Sprint 1**: Configuración base del frontend
- ✅ **Sprint 2**: Sistema de autenticación
- ✅ **Sprint 3**: Dashboard y navegación
- ✅ **Sprint 4**: Gestión completa de deudas
- 🔄 **Sprint 5**: Testing y optimizaciones
- ⏳ **Sprint 6**: PWA y mejoras de UX

## 🌐 Endpoints del Frontend

La aplicación estará disponible en `http://localhost:3000` (configurable via `PORT`).

**Rutas principales**:

- `/` - Página de inicio (redirige a dashboard)
- `/auth` - Autenticación (login/registro)
- `/dashboard` - Dashboard principal

## 🧪 Testing y Cobertura

### Cobertura Obligatoria

- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%
- **Statements**: 100%

### Ejecutar Tests

```bash
# Tests unitarios
bun run test

# Tests con cobertura
bun run test:coverage

# Tests específicos
bun run test src/components/
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Vitest](https://vitest.dev/)
- [Plan de Trabajo Frontend](../docs/plan-trabajo-frontend.md)
- [Guía de Componentes](../docs/componentes.md)

## 🤝 Contribución

1. Asegúrate de que todos los tests pasen: `bun run test`
2. Verifica que la cobertura sea 100%: `bun run test:coverage`
3. Verifica tipos: `bun run check-types`
4. Construye el proyecto: `bun run build`
5. Verifica linting: `bun run lint`

## 🆘 Soporte

Si encuentras problemas:

1. **Verifica la documentación** de cada paquete
2. **Revisa los logs** de la aplicación
3. **Ejecuta los comandos de solución** mencionados arriba
4. **Verifica que todos los paquetes estén construidos**
5. **Revisa las variables de entorno**
6. **Verifica que el backend esté ejecutándose**

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](../../LICENSE) para más detalles.

---

**¿Necesitas ayuda?** Revisa la [documentación](../../docs/) o crea un [issue](https://github.com/tu-usuario/congenial-palm-tree/issues) en GitHub.

**¿Te gusta el proyecto?** ⭐ Dale una estrella en GitHub!
