# API Endpoints - Sistema de Gestión de Deudas

## Base URL

```
http://localhost:3000/api
```

## Estructura de Respuesta

Todas las respuestas siguen el formato `BaseResponseDto<T>`:

```json
{
  "success": boolean,
  "message": string,
  "data": T,
  "timestamp": Date
}
```

---

## 🔐 Autenticación (Auth)

### POST `/auth/register`

**Registrar un nuevo usuario**

**Body:**

```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Respuestas:**

- **201 Created**: Usuario registrado exitosamente
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": number,
      "user": {
        "id": "string",
        "email": "string",
        "fullName": "string",
        "isActive": boolean
      }
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos
- **409 Conflict**: Usuario ya existe

---

### POST `/auth/login`

**Iniciar sesión de usuario**

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Respuestas:**

- **200 OK**: Usuario autenticado exitosamente
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": number,
      "user": {
        "id": "string",
        "email": "string",
        "fullName": "string",
        "isActive": boolean
      }
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: Credenciales inválidas

---

### POST `/auth/refresh`

**Renovar token de acceso**

**Body:**

```json
{
  "refreshToken": "string"
}
```

**Respuestas:**

- **200 OK**: Token renovado exitosamente
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": number,
      "user": {
        "id": "string",
        "email": "string",
        "fullName": "string",
        "isActive": boolean
      }
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: Token de renovación inválido

---

### POST `/auth/logout`

**Cerrar sesión de usuario**

**Headers:** `Authorization: Bearer {token}`

**Respuestas:**

- **200 OK**: Usuario cerró sesión exitosamente
  ```json
  {
    "success": true,
    "message": "User logged out successfully",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

### GET `/auth/profile`

**Obtener perfil del usuario actual**

**Headers:** `Authorization: Bearer {token}`

**Respuestas:**

- **200 OK**: Perfil obtenido exitosamente
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "isActive": boolean,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

## 👥 Usuarios (Users)

### POST `/users`

**Crear un nuevo usuario**

**Body:**

```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Respuestas:**

- **201 Created**: Usuario creado exitosamente
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "isActive": boolean,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos
- **409 Conflict**: Usuario ya existe

---

### GET `/users`

**Obtener todos los usuarios con paginación**

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `search` (opcional): Término de búsqueda

**Respuestas:**

- **200 OK**: Usuarios obtenidos exitosamente
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
      "users": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50,
        "totalPages": 5
      }
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

### GET `/users/:id`

**Obtener usuario por ID**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID del usuario

**Respuestas:**

- **200 OK**: Usuario obtenido exitosamente
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "isActive": boolean,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante
- **404 Not Found**: Usuario no encontrado

---

### PUT `/users/:id`

**Actualizar usuario por ID**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID del usuario

**Body:**

```json
{
  "email": "string",
  "fullName": "string"
}
```

**Respuestas:**

- **200 OK**: Usuario actualizado exitosamente
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "isActive": boolean,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: Token inválido o faltante
- **404 Not Found**: Usuario no encontrado
- **409 Conflict**: Email ya está en uso

---

### DELETE `/users/:id`

**Eliminar usuario por ID**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID del usuario

**Respuestas:**

- **200 OK**: Usuario eliminado exitosamente
  ```json
  {
    "success": true,
    "message": "User deleted successfully",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Usuario tiene deudas activas
- **401 Unauthorized**: Token inválido o faltante
- **404 Not Found**: Usuario no encontrado

---

### GET `/users/profile/me`

**Obtener perfil del usuario actual**

**Headers:** `Authorization: Bearer {token}`

**Respuestas:**

- **200 OK**: Perfil obtenido exitosamente
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "isActive": boolean,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

## 💰 Deudas (Debts)

### POST `/debts`

**Crear una nueva deuda**

**Headers:** `Authorization: Bearer {token}`

**Body:**

```json
{
  "description": "string",
  "amount": number,
  "currency": "string",
  "debtorId": "string",
  "dueDate": "string (ISO date)",
  "notes": "string",
  "category": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT"
}
```

**Respuestas:**

- **201 Created**: Deuda creada exitosamente
  ```json
  {
    "success": true,
    "message": "Debt created successfully",
    "data": {
      "id": "string",
      "description": "string",
      "amount": number,
      "currency": "string",
      "status": "PENDING",
      "isPaid": false,
      "creditorId": "string",
      "debtorId": "string",
      "creditor": {...},
      "debtor": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "notes": "string",
      "category": "string",
      "priority": "MEDIUM"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos o violación de reglas de negocio
- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Usuario no puede crear esta deuda
- **404 Not Found**: Acreedor o deudor no encontrado

---

### GET `/debts`

**Obtener todas las deudas con filtros y paginación**

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `status` (opcional): Estado de la deuda (`PENDING`, `PAID`, `OVERDUE`, `CANCELLED`)
- `isPaid` (opcional): Boolean
- `priority` (opcional): Prioridad (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `category` (opcional): Categoría
- `search` (opcional): Búsqueda en descripción
- `sortBy` (opcional): Campo de ordenamiento (`createdAt`, `amount`, `dueDate`, `priority`)
- `sortOrder` (opcional): Orden (`asc`, `desc`)

**Respuestas:**

- **200 OK**: Deudas obtenidas exitosamente
  ```json
  {
    "success": true,
    "message": "Debts retrieved successfully",
    "data": {
      "debts": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 25,
        "totalPages": 3
      }
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

### GET `/debts/dashboard/summary`

**Obtener resumen del dashboard con estadísticas de deudas**

**Headers:** `Authorization: Bearer {token}`

**Respuestas:**

- **200 OK**: Resumen del dashboard obtenido exitosamente
  ```json
  {
    "success": true,
    "message": "Dashboard summary retrieved successfully",
    "data": {
      "totalDebts": 25,
      "totalAmount": 1250.50,
      "pendingDebts": 15,
      "paidDebts": 8,
      "overdueDebts": 2,
      "currency": "USD",
      "recentActivity": [...]
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

### GET `/debts/export/stats`

**Obtener estadísticas de exportación y opciones disponibles**

**Headers:** `Authorization: Bearer {token}`

**Respuestas:**

- **200 OK**: Estadísticas de exportación obtenidas exitosamente
  ```json
  {
    "success": true,
    "message": "Export statistics retrieved successfully",
    "data": {
      "totalDebts": 25,
      "availableFormats": ["csv", "excel", "pdf"],
      "filters": {...}
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante

---

### POST `/debts/export`

**Exportar deudas en formato especificado con filtros**

**Headers:** `Authorization: Bearer {token}`

**Body:**

```json
{
  "format": "csv | excel | pdf",
  "filters": {
    "status": "string",
    "priority": "string",
    "category": "string",
    "dateRange": {
      "start": "string (ISO date)",
      "end": "string (ISO date)"
    }
  }
}
```

**Respuestas:**

- **200 OK**: Deudas exportadas exitosamente (archivo descargable)
- **400 Bad Request**: Parámetros de exportación inválidos
- **401 Unauthorized**: Token inválido o faltante

---

### GET `/debts/:id`

**Obtener deuda por ID**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID de la deuda

**Respuestas:**

- **200 OK**: Deuda obtenida exitosamente
  ```json
  {
    "success": true,
    "message": "Debt retrieved successfully",
    "data": {
      "id": "string",
      "description": "string",
      "amount": number,
      "currency": "string",
      "status": "PENDING",
      "isPaid": false,
      "creditorId": "string",
      "debtorId": "string",
      "creditor": {...},
      "debtor": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "notes": "string",
      "category": "string",
      "priority": "MEDIUM"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Usuario no tiene acceso a esta deuda
- **404 Not Found**: Deuda no encontrada

---

### PUT `/debts/:id`

**Actualizar deuda**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID de la deuda

**Body:**

```json
{
  "description": "string",
  "amount": number,
  "currency": "string",
  "dueDate": "string (ISO date)",
  "notes": "string",
  "category": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT"
}
```

**Respuestas:**

- **200 OK**: Deuda actualizada exitosamente
  ```json
  {
    "success": true,
    "message": "Debt updated successfully",
    "data": {
      "id": "string",
      "description": "string",
      "amount": number,
      "currency": "string",
      "status": "PENDING",
      "isPaid": false,
      "creditorId": "string",
      "debtorId": "string",
      "creditor": {...},
      "debtor": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "notes": "string",
      "category": "string",
      "priority": "MEDIUM"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Datos inválidos o violación de reglas de negocio
- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Solo el acreedor puede modificar la deuda
- **404 Not Found**: Deuda no encontrada

---

### PUT `/debts/:id/mark-as-paid`

**Marcar deuda como pagada**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID de la deuda

**Respuestas:**

- **200 OK**: Deuda marcada como pagada exitosamente
  ```json
  {
    "success": true,
    "message": "Debt marked as paid successfully",
    "data": {
      "id": "string",
      "description": "string",
      "amount": number,
      "currency": "string",
      "status": "PAID",
      "isPaid": true,
      "creditorId": "string",
      "debtorId": "string",
      "creditor": {...},
      "debtor": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "paidAt": "2024-01-20T15:45:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```
- **400 Bad Request**: Deuda ya está pagada
- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Solo el acreedor puede marcar la deuda como pagada
- **404 Not Found**: Deuda no encontrada

---

### DELETE `/debts/:id`

**Eliminar deuda**

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**

- `id`: ID de la deuda

**Respuestas:**

- **204 No Content**: Deuda eliminada exitosamente
- **400 Bad Request**: No se pueden eliminar deudas pagadas
- **401 Unauthorized**: Token inválido o faltante
- **403 Forbidden**: Solo el acreedor puede eliminar la deuda
- **404 Not Found**: Deuda no encontrada

---

## 🏥 Salud del Sistema (Health)

### GET `/health`

**Verificar estado general del sistema**

**Respuestas:**

- **200 OK**: Estado del sistema
  ```json
  {
    "status": "healthy | error",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "services": {
      "database": "healthy | error",
      "cache": "healthy | error"
    }
  }
  ```

---

### GET `/health/check`

**Ejecutar verificaciones de salud del sistema**

**Respuestas:**

- **200 OK**: Resultado de las verificaciones
  ```json
  {
    "status": "healthy | error",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "checks": {
      "database": "healthy | error",
      "cache": "healthy | error"
    }
  }
  ```

---

### GET `/health/ping`

**Verificación simple de latencia**

**Respuestas:**

- **200 OK**: Respuesta de ping
  ```json
  {
    "message": "pong",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```

---

### GET `/health/ready`

**Verificar si el servicio está listo para recibir tráfico**

**Respuestas:**

- **200 OK**: Servicio listo
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "services": {...}
  }
  ```
- **503 Service Unavailable**: Servicio no está listo

---

### GET `/health/live`

**Verificar si el servicio está vivo**

**Respuestas:**

- **200 OK**: Servicio vivo
  ```json
  {
    "status": "alive",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```

---

## 🔒 Autenticación y Autorización

### Headers de Autenticación

Para endpoints protegidos, incluir el header:

```
Authorization: Bearer {jwt_token}
```

### Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Operación exitosa sin contenido
- **400 Bad Request**: Solicitud inválida
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: No autorizado
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado)
- **503 Service Unavailable**: Servicio no disponible

### Manejo de Errores

Los errores siguen el formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "statusCode": number,
    "timestamp": "string",
    "path": "string",
    "method": "string"
  }
}
```

---

## 📝 Notas Adicionales

- Todos los endpoints que requieren autenticación están protegidos con `JwtAuthGuard`
- Las fechas se manejan en formato ISO 8601
- La paginación es opcional y tiene valores por defecto
- Los filtros de búsqueda son opcionales y se pueden combinar
- Las exportaciones generan archivos temporales que se limpian automáticamente
- El sistema valida permisos para asegurar que solo los acreedores puedan modificar sus deudas
