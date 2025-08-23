# Variables Principales

```bash
# Básicas
NODE_ENV=development|staging|production|test
PORT=3000

# Base de datos PostgreSQL
POSTGRES_DB=deudas_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL="postgresql://postgres:password@localhost:5432/deudas_app?schema=public"

# Redis (caché)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=tu_secreto_super_seguro_para_jwt
JWT_EXPIRES_IN=24h
```
