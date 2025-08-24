# 🐳 Configuración de Docker para el Proyecto Deudas

Este documento explica cómo configurar y ejecutar el proyecto completo usando Docker Compose.

## 📋 Servicios Disponibles

### 🚀 Backend (NestJS)

- **Puerto**: 8080
- **URL**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

### 🌐 Frontend (Next.js)

- **Puerto**: 3000
- **URL**: http://localhost:3000
- **Hot Reload**: Habilitado para desarrollo

### 🗄️ Base de Datos (PostgreSQL)

- **Puerto**: 5432
- **Base de datos**: deudas_app
- **Usuario**: postgres
- **Contraseña**: password

### 🔴 Redis (Caché)

- **Puerto**: 6379
- **Persistencia**: Habilitada (AOF)

### 🔍 Prisma Studio (Solo desarrollo)

- **Puerto**: 5555
- **URL**: http://localhost:5555

### 🔧 pgAdmin (Solo desarrollo)

- **Puerto**: 8082
- **URL**: http://localhost:8082
- **Email**: admin@deudas.com
- **Contraseña**: admin123

### 📊 Redis Commander (Solo desarrollo)

- **Puerto**: 8081
- **URL**: http://localhost:8081
- **Usuario**: admin
- **Contraseña**: admin123

## 🚀 Inicio Rápido

### 1. Prerrequisitos

- Docker instalado y corriendo
- Docker Compose instalado
- Git (para clonar el repositorio)

### 2. Configuración del Entorno

```bash
# Copiar el archivo de ejemplo
cp example.env .env.development.local

# Editar las variables si es necesario
nano .env.development.local
```

### 3. Ejecutar Todo el Stack

```bash
# Levantar todos los servicios (incluyendo herramientas de desarrollo)
docker compose --profile dev up --build -d

# O solo los servicios principales
docker compose up --build -d
```

### 4. Verificar el Estado

```bash
# Ver estado de todos los servicios
docker compose ps

# Ver logs en tiempo real
docker compose logs -f [servicio]
```

## 🧪 Script de Prueba Automática

Se incluye un script que automatiza la verificación de todos los servicios:

```bash
# Ejecutar el script de prueba
./test-docker.sh
```

Este script:

- Verifica que Docker esté corriendo
- Crea el archivo de entorno si no existe
- Construye y levanta todos los servicios
- Verifica el estado de cada servicio
- Comprueba que los puertos estén abiertos
- Muestra un resumen de todos los servicios disponibles

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Levantar servicios
docker compose up -d

# Detener servicios
docker compose down

# Reconstruir y levantar
docker compose up --build -d

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f postgres
```

### Acceso a Contenedores

```bash
# Entrar al contenedor del frontend
docker compose exec frontend sh

# Entrar al contenedor del backend
docker compose exec backend sh

# Entrar a PostgreSQL
docker compose exec postgres psql -U postgres -d deudas_app

# Entrar a Redis
docker compose exec redis redis-cli
```

### Limpieza

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker compose down -v

# Eliminar imágenes no utilizadas
docker system prune -a

# Eliminar volúmenes no utilizados
docker volume prune
```

## 🐛 Solución de Problemas

### El frontend no se carga

```bash
# Verificar logs del frontend
docker compose logs frontend

# Verificar que el puerto 3000 esté libre
netstat -tulpn | grep :3000
```

### El backend no responde

```bash
# Verificar logs del backend
docker compose logs backend

# Verificar que PostgreSQL esté funcionando
docker compose exec postgres pg_isready -U postgres
```

### Problemas de permisos

```bash
# Cambiar permisos de archivos si es necesario
chmod +x test-docker.sh
chmod 644 .env.development.local
```

### Puerto ya en uso

```bash
# Ver qué proceso está usando el puerto
lsof -i :3000
lsof -i :8080

# Terminar el proceso si es necesario
kill -9 [PID]
```

## 📝 Notas de Desarrollo

### Hot Reload

- El frontend tiene habilitado hot reload para desarrollo
- Los cambios en `apps/frontend/src` se reflejan automáticamente
- Los cambios en `apps/backend/src` también se reflejan automáticamente

### Variables de Entorno

- El frontend puede acceder a variables del backend usando `NEXT_PUBLIC_API_URL`
- Las variables de base de datos se configuran en `.env.development.local`
- El backend lee las variables desde el mismo archivo

### Persistencia de Datos

- PostgreSQL: Los datos se mantienen en el volumen `postgres_data`
- Redis: Los datos se mantienen en el volumen `redis_data`
- pgAdmin: La configuración se mantiene en el volumen `pgadmin_data`

## 🚀 Producción

Para producción, se recomienda:

1. Comentar los volúmenes de hot reload
2. Usar el perfil `prod` que incluye Nginx
3. Configurar variables de entorno apropiadas
4. Usar imágenes optimizadas para producción

```bash
# Levantar solo servicios de producción
docker compose --profile prod up -d
```

## 📞 Soporte

Si encuentras problemas:

1. Verifica los logs de los servicios
2. Asegúrate de que Docker esté corriendo
3. Verifica que los puertos no estén en uso
4. Ejecuta el script de prueba automática
5. Revisa la configuración del archivo `.env.development.local`
