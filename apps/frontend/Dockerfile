# Usar la imagen oficial de Node.js con Bun
FROM oven/bun:1-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json bun.lock turbo.json ./

# Copiar directorios de paquetes completos (necesario para workspaces)
COPY packages/ ./packages/

# Copiar directorio de la aplicación
COPY apps/web_next/ ./apps/web_next/

# Instalar dependencias
RUN bun install

# Copiar el resto del código fuente
COPY . .

# Generar el cliente de Prisma
RUN bun run db:generate

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["bun", "run", "next:dev"]
