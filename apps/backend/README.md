# 🚀 Backend - Gestión de Deudas

Backend desarrollado en **NestJS + TypeScript** para la aplicación de gestión de deudas entre amigos, construido como parte de un monorepo con paquetes compartidos.

## 🏗️ Arquitectura del Monorepo

### Estructura General

```
congenial-palm-tree/
├── apps/
│   └── backend/           # 🎯 Esta aplicación
├── packages/
│   ├── config/            # ⚙️ Configuraciones compartidas
│   │   ├── env/          # 🌍 Variables de entorno
│   │   ├── typescript/   # 📝 Configuración TS
│   │   └── vitest/       # 🧪 Configuración de tests
│   └── database/         # 🗄️ Cliente Prisma + esquemas
└── turbo.json            # 🚀 Configuración del monorepo
```

### Paquetes Principales

#### 📦 `@repo/env` - Gestión de Variables de Entorno

- **Ubicación**: `packages/config/env/`
- **Función**: Carga automática de variables de entorno por ambiente
- **Características**:
  - Detección automática del entorno (`development`, `staging`, `production`, `test`)
  - Búsqueda inteligente de archivos `.env` en la raíz del monorepo
  - Validación con Zod para tipos seguros
  - Fallback a archivos de ejemplo si no existe configuración

#### 📦 `@repo/database` - Base de Datos

- **Ubicación**: `packages/database/`
- **Función**: Cliente Prisma preconfigurado con modelos de datos
- **Características**:
  - Cliente Prisma generado automáticamente
  - Modelos para User, Debt, DomainEvent, AuditLog
  - Manejo automático de conexiones (desarrollo vs producción)
  - Seeds de datos de ejemplo incluidos

#### 📦 `@repo/vitest` - Testing

- **Ubicación**: `packages/config/vitest/`
- **Función**: Configuraciones centralizadas de testing
- **Características**:
  - Cobertura de código al 100% obligatoria
  - Configuraciones específicas para React, Astro y proyectos base
  - Reportes en múltiples formatos (HTML, JSON, consola)

## 📋 Prerrequisitos

- **Node.js**: 18+ (recomendado 20+)
- **PostgreSQL**: 13+ (recomendado 15+)
- **Redis**: 6+ (recomendado 7+)
- **Bun**: 1.0+ (recomendado) o npm 9+
- **Docker**: Para servicios de base de datos (opcional)

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
cp ../../example.env.local .env.local

# Editar variables según tu entorno
nano .env.local
```

**Variables requeridas:**

```env
# Básicas
NODE_ENV=development
PORT=3000

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/deudas_app"
POSTGRES_DB=deudas_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Redis (caché)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=tu_secreto_super_seguro_para_jwt
JWT_EXPIRES_IN=24h
```

### 3. Generar cliente de Prisma

```bash
# Desde la raíz del monorepo
cd packages/database
bun run generate
cd ../../apps/backend
```

### 4. Ejecutar migraciones y seeds

```bash
# Sincronizar esquema con la base de datos
cd ../../packages/database
bun run db:push

# Opcional: Poblar con datos de ejemplo
bun run db:seed

cd ../../apps/backend
```

## 🏃‍♂️ Comandos de Desarrollo

### Comandos Principales

```bash
# Desarrollo con hot reload
bun run start:dev

# Compilar para producción
bun run build

# Ejecutar en producción
bun run start:prod

# Ejecutar pruebas
bun run test

# Verificar tipos
bun run check-types

# Probar conexión a base de datos
bun run test:db
```

### Comandos de Testing

```bash
# Ejecutar tests con cobertura
bun run test:coverage

# Tests en modo watch
bun run test:watch

# Tests específicos
bun run test src/auth/auth.service.spec.ts

# UI de Vitest
bun run test:ui
```

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # 🔐 Autenticación JWT
│   ├── guards/             # Guards de autenticación
│   ├── decorators/         # Decoradores personalizados
│   └── dto/                # DTOs de autenticación
├── users/                   # 👥 Gestión de usuarios
│   ├── dto/                # DTOs de usuario
│   └── interfaces/         # Interfaces de usuario
├── debts/                   # 💰 Gestión de deudas
│   ├── dto/                # DTOs de deuda
│   ├── export/             # Servicio de exportación
│   └── interfaces/         # Interfaces de deuda
├── common/                  # 🔧 Recursos compartidos
│   ├── dto/                # DTOs base
│   ├── filters/            # Filtros de excepción
│   └── interfaces/         # Interfaces comunes
├── database/                # 🗄️ Configuración de base de datos
├── cache/                   # 📦 Sistema de caché con Redis
├── config/                  # ⚙️ Configuración de entorno
└── health/                  # 🏥 Endpoints de salud del sistema
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
      "@auth/*": ["./src/auth/*"],
      "@users/*": ["./src/users/*"],
      "@debts/*": ["./src/debts/*"],
      "@common/*": ["./src/common/*"]
    }
  }
}
```

### Configuración de Vitest

```typescript
// vitest.config.mjs
import { baseConfig } from '@repo/vitest';

export default baseConfig;
```

## 🐛 Solución de Problemas

### Problemas con `@repo/env`

#### Error: "Cannot find module '@repo/env'"

```bash
# Solución: Reconstruir el paquete
cd packages/config/env
bun run build
cd ../../apps/backend
```

#### Error: "Environment file not found"

```bash
# Verificar que existe el archivo .env.local
ls -la .env.local

# Si no existe, copiar desde el ejemplo
cp ../../example.env.local .env.local
```

#### Error: "Invalid environment variables"

```bash
# Verificar que todas las variables requeridas estén definidas
cat .env.local | grep -E "(DATABASE_URL|JWT_SECRET|REDIS_HOST)"

# Regenerar el paquete env
cd packages/config/env
bun run build
cd ../../apps/backend
```

### Problemas con `@repo/database`

#### Error: "Prisma client not generated"

```bash
# Solución: Generar cliente Prisma
cd packages/database
bun run generate
cd ../../apps/backend
```

#### Error: "Database connection failed"

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar variables de entorno
echo $DATABASE_URL

# Probar conexión manual
psql $DATABASE_URL -c "SELECT 1;"
```

#### Error: "Schema validation failed"

```bash
# Validar esquema Prisma
cd packages/database
bun run db:validate

# Sincronizar esquema
bun run db:push

cd ../../apps/backend
```

### Problemas con `@repo/vitest`

#### Error: "Coverage thresholds not met"

```bash
# Verificar cobertura actual
bun run test:coverage

# Ejecutar tests específicos que fallen
bun run test --reporter=verbose

# Verificar configuración de cobertura
cat vitest.config.mjs
```

#### Error: "Cannot resolve module in tests"

```bash
# Verificar alias de TypeScript
cat tsconfig.json | grep paths

# Reconstruir paquete vitest
cd packages/config/vitest
bun run build
cd ../../apps/backend
```

### Problemas de Build General

#### Error: "TypeScript compilation failed"

```bash
# Limpiar builds anteriores
rm -rf dist/
rm -rf node_modules/.cache/

# Reinstalar dependencias
rm -rf node_modules/
bun install

# Verificar tipos
bun run check-types
```

#### Error: "Turbo build failed"

```bash
# Limpiar cache de Turbo
bun run turbo clean

# Reconstruir todo el monorepo
bun run build
```

#### Error: "Workspace dependencies not found"

```bash
# Verificar que todos los paquetes estén construidos
cd packages/config/env && bun run build
cd ../database && bun run build
cd ../vitest && bun run build
cd ../../apps/backend

# Reinstalar dependencias
bun install
```

## 🔄 Flujo de Desarrollo

### 1. Iniciar Servicios

```bash
# PostgreSQL (si usas Docker)
docker run -d --name postgres-deudas \
  -e POSTGRES_DB=deudas_app \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# Redis (si usas Docker)
docker run -d --name redis-deudas \
  -p 6379:6379 redis:7-alpine
```

### 2. Configurar Entorno

```bash
# Copiar y configurar variables
cp ../../example.env.local .env.local

# Editar variables según tu setup
nano .env.local
```

### 3. Preparar Base de Datos

```bash
# Generar cliente Prisma
cd ../../packages/database
bun run generate

# Sincronizar esquema
bun run db:push

# Opcional: Datos de ejemplo
bun run db:seed

cd ../../apps/backend
```

### 4. Ejecutar Aplicación

```bash
# Desarrollo
bun run start:dev

# O producción
bun run build
bun run start:prod
```

## 📊 Estado del Proyecto

- ✅ **Sprint 1**: Configuración base del monorepo completada
- ✅ **Sprint 2**: Autenticación y usuarios implementados
- ✅ **Sprint 3**: Módulo de deudas funcional
- 🔄 **Sprint 4**: Caché y optimizaciones (en progreso)
- ⏳ **Sprint 5**: Testing completo y documentación

## 🌐 Endpoints de la API

La API estará disponible en `http://localhost:3000` (configurable via `PORT`).

**Documentación completa**: [API_ENDPOINTS.md](../../docs/API_ENDPOINTS.md)

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
bun run test src/auth/
```

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Documentación de Vitest](https://vitest.dev/)
- [Plan de Trabajo Backend](../docs/plan-trabajo-backend.md)
- [API Endpoints](../../docs/API_ENDPOINTS.md)

## 🤝 Contribución

1. Asegúrate de que todos los tests pasen: `bun run test`
2. Verifica que la cobertura sea 100%: `bun run test:coverage`
3. Verifica tipos: `bun run check-types`
4. Construye el proyecto: `bun run build`

## 🆘 Soporte

Si encuentras problemas:

1. **Verifica la documentación** de cada paquete
2. **Revisa los logs** de la aplicación
3. **Ejecuta los comandos de solución** mencionados arriba
4. **Verifica que todos los paquetes estén construidos**
5. **Revisa las variables de entorno**
