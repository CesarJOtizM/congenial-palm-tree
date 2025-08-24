# 🏗️ Dutch - Gestión de Deudas entre Amigos

Aplicación completa para gestionar deudas entre amigos, construida como un **monorepo moderno** con arquitectura escalable y tecnologías de vanguardia.

## 🌟 Características Principales

- **🔐 Autenticación JWT** con gestión de usuarios
- **💰 Gestión completa de deudas** con categorías y prioridades
- **📊 Dashboard interactivo** con estadísticas en tiempo real
- **📱 Aplicación web responsive** construida con Next.js 15
- **🚀 API REST robusta** desarrollada en NestJS
- **🗄️ Base de datos PostgreSQL** con Prisma ORM
- **📦 Sistema de caché** con Redis
- **🐳 Docker completo** para desarrollo y producción
- **🧪 Testing exhaustivo** con cobertura del 100%

## 🏗️ Arquitectura del Monorepo

### Estructura General

```
dutch/
├── apps/
│   ├── backend/           # 🚀 API NestJS
│   └── frontend/          # 🌐 Aplicación Next.js
├── packages/
│   ├── config/            # ⚙️ Configuraciones compartidas
│   │   ├── env/          # 🌍 Variables de entorno
│   │   ├── typescript/   # 📝 Configuración TS
│   │   ├── eslint/       # 🔍 Linting
│   │   ├── prettier/     # ✨ Formateo de código
│   │   ├── stylelint/    # 🎨 Linting de CSS
│   │   └── vitest/       # 🧪 Configuración de tests
│   └── database/         # 🗄️ Cliente Prisma + esquemas
├── docker-compose.yml     # 🐳 Orquestación de servicios
├── test-docker.sh         # 🧪 Script de prueba automática
└── turbo.json            # 🚀 Configuración del monorepo
```

### Aplicaciones

#### 🚀 **Backend (NestJS)**

- **Ubicación**: `apps/backend/`
- **Puerto**: 8080
- **Tecnologías**: NestJS, TypeScript, Prisma, Redis
- **Funcionalidades**: API REST, autenticación JWT, gestión de usuarios y deudas

#### 🌐 **Frontend (Next.js)**

- **Ubicación**: `apps/frontend/`
- **Puerto**: 3000
- **Tecnologías**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Funcionalidades**: Interfaz de usuario, dashboard, gestión de deudas

### Paquetes Compartidos

#### 📦 **@repo/config** - Configuraciones Centralizadas

- **Ubicación**: `packages/config/`
- **Función**: Configuraciones compartidas para todo el monorepo
- **Módulos**:
  - `env/`: Gestión de variables de entorno
  - `typescript/`: Configuración de TypeScript
  - `eslint/`: Reglas de linting
  - `prettier/`: Formateo de código
  - `stylelint/`: Linting de CSS
  - `vitest/`: Configuración de testing

#### 📦 **@repo/database** - Base de Datos

- **Ubicación**: `packages/database/`
- **Función**: Cliente Prisma preconfigurado con modelos de datos
- **Características**:
  - Cliente Prisma generado automáticamente
  - Modelos para User, Debt, DomainEvent, AuditLog
  - Seeds de datos de ejemplo incluidos

## 📋 Prerrequisitos

- **Node.js**: 18+ (recomendado 20+)
- **Bun**: 1.0+ (recomendado) o npm 9+
- **Docker**: Para servicios de base de datos (recomendado)
- **PostgreSQL**: 13+ (recomendado 15+)
- **Redis**: 6+ (recomendado 7+)

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado) 🐳

#### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd dutch
```

#### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp example.env .env.development.local

# Editar variables si es necesario
nano .env.development.local
```

#### 3. Ejecutar todo el stack con docker.sh

```bash
# Hacer ejecutable el script de Docker
chmod +x scripts/docker.sh

# 🚀 PASO 1: Iniciar servicios de desarrollo
./scripts/docker.sh dev

# 🔧 PASO 2: Generar cliente Prisma (OBLIGATORIO)
./scripts/docker.sh prisma:generate

# 📊 PASO 3: Aplicar migraciones a la base de datos
./scripts/docker.sh prisma:migrate

# 🌱 PASO 4: Insertar datos de ejemplo
./scripts/docker.sh prisma:seed
```

**O usar el comando completo de desarrollo:**

```bash
# Iniciar todos los servicios con herramientas de desarrollo
./scripts/docker.sh dev-full
```

**Verificar estado de los servicios:**

```bash
# Ver estado de todos los servicios
./scripts/docker.sh health

# Ver logs en tiempo real
./scripts/docker.sh logs
```

#### 4. Acceder a la aplicación

- **🌐 Frontend**: http://localhost:3000
- **🚀 Backend**: http://localhost:8080
- **🔧 pgAdmin**: http://localhost:8082 (admin@deudas.com / admin123)
- **📊 Redis Commander**: http://localhost:8081 (admin / admin123)

#### 5. Comandos útiles del script docker.sh

```bash
# Ver todos los comandos disponibles
./scripts/docker.sh help

# Acceder a shells de los contenedores
./scripts/docker.sh shell              # Shell del backend
./scripts/docker.sh frontend-shell     # Shell del frontend
./scripts/docker.sh db-shell           # Shell de PostgreSQL
./scripts/docker.sh redis-shell        # Shell de Redis

# Gestión de servicios
./scripts/docker.sh stop               # Detener todos los servicios
./scripts/docker.sh restart            # Reiniciar servicios
./scripts/docker.sh clean              # Limpiar recursos Docker
./scripts/docker.sh reset              # Reset completo del proyecto
```

### Opción 1.2: Producción con Docker 🚀

#### 1. Configurar variables de producción

```bash
# Copiar archivo de ejemplo
cp example.env .env.production.local

# Editar variables para producción
nano .env.production.local
```

#### 2. Ejecutar stack de producción

```bash
# 🚀 PASO 1: Iniciar servicios de producción
./scripts/docker.sh prod

# 🔧 PASO 2: Generar cliente Prisma
./scripts/docker.sh prisma:generate

# 📊 PASO 3: Aplicar migraciones de producción
./scripts/docker.sh prisma:migrate

# 🌱 PASO 4: Opcional - Insertar datos iniciales
./scripts/docker.sh prisma:seed
```

**Verificar estado de producción:**

```bash
# Ver estado de los servicios
./scripts/docker.sh health

# Ver logs de producción
./scripts/docker.sh logs
```

### Opción 2: Desarrollo Local 🔧

#### 1. Instalar dependencias

```bash
# Instalar dependencias del monorepo
bun install

# O si prefieres npm
npm install
```

#### 2. Configurar servicios de base de datos

```bash
# PostgreSQL
docker run -d --name postgres-dutch \
  -e POSTGRES_DB=dutch_app \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# Redis
docker run -d --name redis-dutch \
  -p 6379:6379 redis:7-alpine
```

#### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp example.env .env.development.local

# Editar variables según tu setup
nano .env.development.local
```

#### 4. Preparar base de datos

```bash
# Navegar al paquete de base de datos
cd packages/database

# Generar cliente Prisma (OBLIGATORIO)
bun run generate

# Para DESARROLLO: Sincronizar esquema directamente
bun run db:push

# Para PRODUCCIÓN: Usar migraciones (recomendado)
# bun run db:migrate:deploy

# Opcional: Datos de ejemplo para desarrollo
bun run db:seed

# Volver al directorio raíz
cd ../..
```

#### 5. Ejecutar aplicaciones

```bash
# Terminal 1: Backend
cd apps/backend
bun run start:dev

# Terminal 2: Frontend
cd apps/frontend
bun run dev
```

## 🏃‍♂️ Comandos de Desarrollo

### Comandos de Base de Datos con docker.sh (Recomendado)

```bash
# 🔧 GENERAR CLIENTE PRISMA (OBLIGATORIO)
./scripts/docker.sh prisma:generate    # Genera el cliente Prisma desde el esquema

# 📊 SINCRONIZAR ESQUEMA
./scripts/docker.sh prisma:deploy      # Para desarrollo: sincroniza esquema directamente
./scripts/docker.sh prisma:migrate     # Para producción: aplica migraciones existentes

# 🌱 DATOS DE EJEMPLO
./scripts/docker.sh prisma:seed        # Inserta datos de prueba (solo desarrollo)

# 🗑️ RESETEAR BASE DE DATOS
./scripts/docker.sh prisma:reset       # Elimina y recrea la base (¡CUIDADO!)

# 🚀 ABRIR PRISMA STUDIO
./scripts/docker.sh prisma:studio      # Abre Prisma Studio en el navegador
```

### Comandos de Base de Datos (Desarrollo Local)

```bash
# Navegar al paquete de base de datos
cd packages/database

# 🔧 GENERAR CLIENTE PRISMA (OBLIGATORIO)
bun run generate          # Genera el cliente Prisma desde el esquema

# 📊 SINCRONIZAR ESQUEMA
bun run db:push          # Para desarrollo: sincroniza esquema directamente
bun run db:migrate:deploy # Para producción: aplica migraciones existentes

# 🚀 CREAR NUEVA MIGRACIÓN
bun run db:migrate:dev   # Crea y aplica nueva migración (desarrollo)

# 🌱 DATOS DE EJEMPLO
bun run db:seed          # Inserta datos de prueba (solo desarrollo)

# 📋 VER ESTADO
bun run db:status        # Muestra estado de migraciones
bun run db:studio        # Abre Prisma Studio en el navegador

# 🗑️ RESETEAR BASE DE DATOS
bun run db:reset         # Elimina y recrea la base (¡CUIDADO!)

# Volver al directorio raíz
cd ../..
```

**⚠️ IMPORTANTE**: Siempre ejecuta `bun run generate` después de cambiar el esquema Prisma.

### 📋 Cuándo Usar Cada Comando

#### 🚀 **Primera vez / Desarrollo**

```bash
cd packages/database
bun run generate          # Generar cliente Prisma
bun run db:push          # Sincronizar esquema
bun run db:seed          # Datos de ejemplo
cd ../..
```

#### 🔄 **Después de cambios en el esquema**

```bash
cd packages/database
bun run generate          # Regenerar cliente
bun run db:push          # Aplicar cambios
cd ../..
```

#### 🚀 **Producción / Staging**

```bash
cd packages/database
bun run generate          # Generar cliente
bun run db:migrate:deploy # Aplicar migraciones
cd ../..
```

#### 🆕 **Crear nueva migración**

```bash
cd packages/database
bun run db:migrate:dev   # Crea y aplica migración
cd ../..
```

### Comandos del Monorepo

```bash
# Desarrollo
bun run dev          # Ejecutar todas las apps en modo desarrollo
bun run build        # Construir todas las apps
bun run test         # Ejecutar tests de todas las apps
bun run lint         # Linting de todo el código
bun run check-types  # Verificar tipos TypeScript

# Testing
bun run test:watch       # Tests en modo watch
bun run test:coverage    # Tests con cobertura

# Linting y formateo
bun run lint:fix         # Corregir problemas de linting
bun run prettier:fix     # Formatear código
bun run stylelint:fix    # Corregir problemas de CSS
```

### Comandos de Docker con docker.sh

```bash
# 🚀 Gestión de servicios
./scripts/docker.sh dev              # Iniciar desarrollo básico
./scripts/docker.sh dev-full         # Iniciar desarrollo completo con herramientas
./scripts/docker.sh prod             # Iniciar producción
./scripts/docker.sh stop             # Detener todos los servicios
./scripts/docker.sh restart          # Reiniciar servicios
./scripts/docker.sh health           # Verificar estado de servicios

# 📋 Logs y debugging
./scripts/docker.sh logs             # Ver logs de todos los servicios
./scripts/docker.sh logs frontend    # Ver logs del frontend
./scripts/docker.sh logs backend     # Ver logs del backend

# 🐚 Acceso a contenedores
./scripts/docker.sh shell            # Shell del backend
./scripts/docker.sh frontend-shell   # Shell del frontend
./scripts/docker.sh db-shell         # Shell de PostgreSQL
./scripts/docker.sh redis-shell      # Shell de Redis

# 🧹 Mantenimiento
./scripts/docker.sh clean            # Limpiar recursos Docker
./scripts/docker.sh reset            # Reset completo del proyecto
```

### Comandos de Docker

**💡 Recomendado: Usar el script `./scripts/docker.sh` para mayor facilidad**

```bash
# Gestión de servicios
docker compose up -d                    # Levantar servicios
docker compose down                     # Detener servicios
docker compose --profile dev up -d      # Levantar con herramientas de desarrollo
docker compose logs -f [servicio]       # Ver logs en tiempo real

# Servicios específicos
docker compose logs -f frontend         # Logs del frontend
docker compose logs -f backend          # Logs del backend
docker compose logs -f postgres         # Logs de PostgreSQL
docker compose logs -f redis            # Logs de Redis

# Acceso a contenedores
docker compose exec frontend sh         # Entrar al frontend
docker compose exec backend sh          # Entrar al backend
docker compose exec postgres psql -U postgres -d dutch_app
docker compose exec redis redis-cli
```

**🚀 Alternativa con docker.sh (más fácil):**

```bash
# Ver todos los comandos disponibles
./scripts/docker.sh help

# Comandos equivalentes
./scripts/docker.sh dev                # Equivale a: docker compose --profile dev up -d
./scripts/docker.sh logs               # Equivale a: docker compose logs -f
./scripts/docker.sh shell              # Equivale a: docker compose exec backend sh
```

## 🔧 Configuración

### Variables de Entorno

**Archivo**: `.env.development.local`

```env
# Configuración de la aplicación
NODE_ENV=development
PORT=8080

# Base de datos PostgreSQL
POSTGRES_DB=dutch_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL="postgresql://postgres:password@localhost:5432/dutch_app"

# Redis (caché)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=tu_secreto_super_seguro_para_jwt
JWT_EXPIRES_IN=24h

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Configuración de TypeScript

```typescript
// tsconfig.json en cada app
{
  "extends": "@repo/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Configuración de ESLint

```typescript
// eslint.config.mjs en cada app
import { baseConfig } from '@repo/config/eslint';

export default baseConfig;
```

## 🧪 Testing

### Cobertura Obligatoria

- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%
- **Statements**: 100%

### Ejecutar Tests

```bash
# Tests de todo el monorepo
bun run test

# Tests con cobertura
bun run test:coverage

# Tests específicos
bun run test --filter=backend
bun run test --filter=frontend

# Tests en modo watch
bun run test:watch
```

## 🐳 Docker

### Servicios Disponibles

| Servicio            | Puerto | Descripción                 |
| ------------------- | ------ | --------------------------- |
| **Frontend**        | 3000   | Aplicación Next.js          |
| **Backend**         | 8080   | API NestJS                  |
| **PostgreSQL**      | 5432   | Base de datos principal     |
| **Redis**           | 6379   | Caché y sesiones            |
| **Prisma Studio**   | 5555   | Explorador de base de datos |
| **pgAdmin**         | 8082   | Administración PostgreSQL   |
| **Redis Commander** | 8081   | Administración Redis        |

### Perfiles de Docker

#### 🧪 **Desarrollo** (`--profile dev`)

```bash
docker compose --profile dev up -d
```

- Incluye todas las herramientas de desarrollo
- Hot reload habilitado
- Volúmenes montados para desarrollo

#### 🚀 **Producción** (`--profile prod`)

```bash
docker compose --profile prod up -d
```

- Solo servicios esenciales
- Nginx como proxy reverso
- Optimizado para producción

## 📁 Estructura del Proyecto

```
dutch/
├── apps/
│   ├── backend/                    # 🚀 API NestJS
│   │   ├── src/
│   │   │   ├── auth/              # 🔐 Autenticación
│   │   │   ├── users/             # 👥 Usuarios
│   │   │   ├── debts/             # 💰 Deudas
│   │   │   ├── common/            # 🔧 Recursos compartidos
│   │   │   └── health/            # 🏥 Health checks
│   │   ├── Dockerfile             # 🐳 Imagen Docker
│   │   └── package.json
│   └── frontend/                   # 🌐 Aplicación Next.js
│       ├── src/
│       │   ├── app/               # 📱 Páginas de la aplicación
│       │   ├── components/        # 🧩 Componentes React
│       │   ├── lib/               # 📚 Utilidades
│       │   └── styles/            # 🎨 Estilos CSS
│       ├── Dockerfile             # 🐳 Imagen Docker
│       └── package.json
├── packages/
│   ├── config/                     # ⚙️ Configuraciones
│   │   ├── env/                   # 🌍 Variables de entorno
│   │   ├── typescript/            # 📝 TypeScript
│   │   ├── eslint/                # 🔍 Linting
│   │   ├── prettier/              # ✨ Formateo
│   │   ├── stylelint/             # 🎨 CSS linting
│   │   └── vitest/                # 🧪 Testing
│   └── database/                  # 🗄️ Base de datos
│       ├── prisma/                # 📊 Esquemas Prisma
│       ├── src/                   # 🔧 Cliente y utilidades
│       └── package.json
├── scripts/                        # 📜 Scripts de utilidad
├── docs/                          # 📚 Documentación
├── docker-compose.yml             # 🐳 Orquestación
├── test-docker.sh                 # 🧪 Script de prueba
├── turbo.json                     # 🚀 Configuración Turbo
└── package.json                   # 📦 Configuración del monorepo
```

## 🚀 Despliegue

### Desarrollo Local

```bash
# Con Docker (recomendado)
./test-docker.sh

# O manualmente
docker compose --profile dev up --build -d
```

### Staging

```bash
# Configurar variables de staging
cp example.env .env.staging.local

# Levantar servicios
docker compose --profile staging up --build -d
```

### Producción

```bash
# Configurar variables de producción
cp example.env .env.production.local

# Levantar servicios de producción
docker compose --profile prod up --build -d
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### El frontend no se carga

```bash
# Verificar logs
docker compose logs frontend

# Verificar puerto
netstat -tulpn | grep :3000

# Reiniciar servicio
docker compose restart frontend
```

#### El backend no responde

```bash
# Verificar logs
docker compose logs backend

# Verificar base de datos
docker compose exec postgres pg_isready -U postgres

# Verificar health check
curl http://localhost:8080/health

# Si hay errores de Prisma, regenerar el cliente:
cd packages/database
bun run generate
cd ../..
```

#### Problemas de Docker

```bash
# Limpiar recursos
docker compose down -v
docker system prune -a

# Reconstruir imágenes
docker compose --profile dev up --build -d
```

### Logs y Debugging

```bash
# Ver logs en tiempo real
docker compose logs -f

# Logs de un servicio específico
docker compose logs -f backend

# Estado de los servicios
docker compose ps

# Información detallada
docker compose top
```

## 📚 Documentación Adicional

- [📖 Backend README](apps/backend/README.md) - Documentación detallada del backend
- [📖 Frontend README](apps/frontend/README.md) - Documentación del frontend
- [📖 Config README](packages/config/README.md) - Configuraciones compartidas
- [📖 Database README](packages/database/README.md) - Base de datos y Prisma
- [📖 API Endpoints](docs/API_ENDPOINTS.md) - Documentación de la API
- [📖 Plan de Trabajo](docs/plan-trabajo.md) - Roadmap del proyecto

## 🤝 Contribución

### Flujo de Desarrollo

1. **Fork** del repositorio
2. **Crear** una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** siguiendo los estándares del proyecto
4. **Ejecutar tests**: `bun run test`
5. **Verificar cobertura**: `bun run test:coverage`
6. **Verificar tipos**: `bun run check-types`
7. **Commit** con mensaje descriptivo
8. **Push** a tu rama
9. **Crear Pull Request**

### Estándares de Código

- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Reglas de linting automáticas
- **Prettier**: Formateo de código automático
- **Testing**: Cobertura del 100% obligatoria
- **Commits**: Mensajes descriptivos en español

## 📊 Estado del Proyecto

- ✅ **Sprint 1**: Configuración base del monorepo
- ✅ **Sprint 2**: Autenticación y usuarios
- ✅ **Sprint 3**: Módulo de deudas
- ✅ **Sprint 4**: Frontend y Docker
- 🔄 **Sprint 5**: Testing y optimizaciones
- ⏳ **Sprint 6**: Despliegue y documentación

## 🆘 Soporte

### Canales de Ayuda

1. **📖 Documentación**: Revisa la documentación de cada módulo
2. **🐛 Issues**: Reporta bugs en GitHub Issues
3. **💬 Discusiones**: Únete a las discusiones de la comunidad
4. **📧 Email**: Contacto directo para consultas urgentes

### Recursos de Aprendizaje

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Turbo Documentation](https://turbo.build/repo/docs)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **NestJS Team** por el framework backend
- **Vercel** por Next.js
- **Prisma** por el ORM moderno
- **Turbo** por el monorepo tooling
- **Comunidad open source** por las contribuciones

---

**¿Necesitas ayuda?** Revisa la [documentación](docs/) o crea un [issue](https://github.com/tu-usuario/dutch/issues) en GitHub.

**¿Te gusta el proyecto?** ⭐ Dale una estrella en GitHub!
