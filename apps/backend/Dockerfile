# 🐳 Multi-stage Dockerfile para Backend NestJS
# Optimizado para monorepo con Bun

# ======================================
# 📦 Base Image
# ======================================
FROM oven/bun:1.2.20-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    dumb-init

# Establecer directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# ======================================
# 🔧 Dependencies Stage
# ======================================
FROM base AS deps

# Copiar archivos de configuración del workspace
COPY package.json bun.lock* ./
COPY turbo.json ./

# Copiar archivos de configuración de packages
COPY packages/config ./packages/config/
COPY packages/database ./packages/database/

# Copiar package.json del backend
COPY apps/backend/package.json ./apps/backend/

# Instalar todas las dependencias
RUN bun install --frozen-lockfile

# ======================================
# 🏗️ Builder Stage
# ======================================
FROM base AS builder

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages

# Copiar código fuente del backend
COPY apps/backend ./apps/backend/

# Copiar configuraciones necesarias
COPY package.json bun.lock* turbo.json ./

# Generar cliente de Prisma
WORKDIR /app/packages/database
RUN bun run generate

# Compilar el backend
WORKDIR /app/apps/backend
RUN bun run build

# Copiar los packages compilados del workspace local
COPY packages/config/env/dist ./packages/config/env/dist/

# ======================================
# 🚀 Runtime Stage
# ======================================
FROM base AS runner

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Copiar archivos necesarios
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages ./packages

# Cambiar al directorio correcto para ejecutar la aplicación
WORKDIR /app

# Cambiar al usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version > /dev/null || exit 1

# Comando de entrada simplificado
CMD ["bun", "run", "start:prod"]
