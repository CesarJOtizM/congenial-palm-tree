# 🚀 Backend - Gestión de Deudas

Backend desarrollado en **NestJS + TypeScript** para la aplicación de gestión de deudas entre amigos.

## 🏗️ Arquitectura

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Caché**: Redis
- **Autenticación**: JWT con Passport
- **Validaciones**: class-validator + class-transformer

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Bun (recomendado) o npm

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
bun install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp ../../example.env.local .env.local
```

### 3. Generar cliente de Prisma

```bash
cd ../../packages/database
bun run generate
cd ../../apps/backend
```

### 4. Ejecutar migraciones

```bash
cd ../../packages/database
bun run db:push
cd ../../apps/backend
```

## 🏃‍♂️ Comandos de Desarrollo

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

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # Autenticación JWT
├── users/                   # Gestión de usuarios
├── debts/                   # Gestión de deudas
├── common/                  # Recursos compartidos
├── database/                # Configuración de base de datos
├── cache/                   # Sistema de caché con Redis
└── config/                  # Configuración de entorno
```

## 🔧 Configuración de Base de Datos

El proyecto usa **Prisma** como ORM, configurado en el paquete `@deudas-app/database`.

### Modelos principales:

- **User**: Usuarios del sistema
- **Debt**: Deudas entre usuarios
- **AuditLog**: Logs de auditoría
- **DomainEvent**: Eventos de dominio

## 🌐 Endpoints de la API

La API estará disponible en `http://localhost:3000` (configurable via `PORT`).

## 📊 Estado del Proyecto

- ✅ **Sprint 1**: Configuración base completada
- 🔄 **Sprint 2**: Autenticación y usuarios (en progreso)
- ⏳ **Sprint 3**: Módulo de deudas
- ⏳ **Sprint 4**: Caché y optimizaciones
- ⏳ **Sprint 5**: Testing y documentación

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL

Verifica que PostgreSQL esté ejecutándose y las variables de entorno estén correctas.

### Error de conexión a Redis

Verifica que Redis esté ejecutándose en el puerto configurado.

### Error de compilación

Ejecuta `bun run build` para ver errores detallados.

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Plan de Trabajo](../docs/plan-trabajo-backend.md)
