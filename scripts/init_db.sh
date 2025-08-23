#!/bin/bash

# Script de inicialización para PostgreSQL
# Este script se ejecuta cuando el contenedor de PostgreSQL se inicia por primera vez
# Se ejecuta automáticamente desde /docker-entrypoint-initdb.d/

set -e

echo "🚀 Inicializando base de datos VitaWallet..."

# Esperar a que PostgreSQL esté listo
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "⏳ Esperando a que PostgreSQL esté listo..."
  sleep 2
done

echo "✅ PostgreSQL está listo, ejecutando scripts de inicialización..."

# Crear extensiones necesarias y configurar la base de datos
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Crear extensiones necesarias para Prisma y funcionalidades avanzadas
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Configurar timezone
    SET timezone = 'UTC';

    -- Crear índices adicionales si es necesario (se ejecutarán después de Prisma)
    -- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    -- CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    -- CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

    -- Configuraciones adicionales para optimización
    ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
    ALTER SYSTEM SET log_statement = 'all';
    ALTER SYSTEM SET log_min_duration_statement = 1000;

    -- Otros scripts de inicialización pueden ir aquí

    SELECT 'Base de datos inicializada correctamente.' as status;
EOSQL

echo "✅ Extensiones y configuraciones aplicadas"

# Verificar que las extensiones se crearon correctamente
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT
        extname as extension_name,
        extversion as version
    FROM pg_extension
    WHERE extname IN ('uuid-ossp', 'pgcrypto');
EOSQL

echo "🎉 ¡Inicialización de base de datos completada exitosamente!"
