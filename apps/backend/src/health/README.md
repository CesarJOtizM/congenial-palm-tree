# 🏥 Health Check - Backend

Sistema de monitoreo de salud para la aplicación backend que verifica el estado de los servicios críticos.

## 📍 Endpoints Disponibles

### 1. **GET** `/health`

Health check completo con información detallada del estado de la aplicación.

**Respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": 15
    },
    "redis": {
      "status": "ok",
      "responseTime": 8
    }
  }
}
```

### 2. **GET** `/health/check`

Health check estándar usando `@nestjs/terminus` para integración con sistemas de monitoreo.

### 3. **GET** `/health/ping`

Verificación simple de que la aplicación está respondiendo.

**Respuesta:**

```json
{
  "message": "pong",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. **GET** `/health/ready`

Verificación de readiness (preparación) del servicio. Retorna 503 si hay problemas.

### 5. **GET** `/health/live`

Verificación de liveness (vida) del servicio. Siempre retorna 200 si la aplicación está ejecutándose.

## 🔍 Servicios Verificados

### Base de Datos (PostgreSQL)

- ✅ Conexión activa
- ✅ Respuesta a consultas simples
- ⏱️ Tiempo de respuesta

### Redis (Caché)

- ✅ Conexión activa
- ✅ Operaciones de lectura/escritura
- ⏱️ Tiempo de respuesta

## 🚀 Uso en Producción

### Kubernetes

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Docker Compose

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/health/ping']
  interval: 30s
  timeout: 10s
  retries: 3
```

### Monitoreo Externo

```bash
# Verificar estado general
curl http://localhost:3000/health

# Verificar readiness
curl http://localhost:3000/health/ready

# Verificar liveness
curl http://localhost:3000/health/live
```

## 🛠️ Configuración

El health check se configura automáticamente al importar el `HealthModule` en `AppModule`.

**Dependencias requeridas:**

- `@nestjs/terminus` - Para health checks estándar
- `DatabaseModule` - Para verificación de PostgreSQL
- `CacheModule` - Para verificación de Redis

## 📊 Interpretación de Estados

- **`status: "ok"`** - Todos los servicios funcionando correctamente
- **`status: "error"`** - Al menos un servicio tiene problemas

### Códigos de Estado HTTP

- **200 OK** - Servicio funcionando correctamente
- **503 Service Unavailable** - Servicio no está listo (endpoint `/ready`)

## 🔧 Personalización

Para agregar nuevos health checks:

1. Crear un nuevo método en `HealthService`
2. Agregarlo al array en `runHealthChecks()`
3. Incluir en la respuesta de `checkHealth()`

## 📝 Logs

El health check registra logs usando el `NestJS Logger`:

- Errores de conexión a base de datos
- Errores de conexión a Redis
- Tiempos de respuesta de cada servicio
