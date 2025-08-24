# 🏦 Dutch - Gestión de Deudas entre Amigos

Una aplicación moderna y completa para gestionar deudas entre amigos, construida con Next.js, NestJS y PostgreSQL.

## 🚀 Características

- **Autenticación completa**: Registro, login y gestión de sesiones
- **Dashboard interactivo**: Resumen visual de deudas y estadísticas
- **Gestión de deudas**: Crear, editar, eliminar y marcar como pagadas
- **Filtros avanzados**: Buscar, filtrar y ordenar deudas
- **Exportación**: Exportar deudas en formato JSON o CSV
- **UI moderna**: Interfaz responsiva y accesible con Tailwind CSS
- **API REST**: Backend robusto con NestJS y TypeScript

## 🏗️ Arquitectura

### Frontend (Next.js 15 + TypeScript)

- **Framework**: Next.js 15 con App Router
- **Estilos**: Tailwind CSS v4
- **Formularios**: React Hook Form + Zod
- **Estado**: Context API + React Hooks
- **Iconos**: Lucide React
- **Validación**: Zod schemas

### Backend (NestJS + TypeScript)

- **Framework**: NestJS con TypeScript
- **Base de datos**: PostgreSQL
- **Cache**: Redis/DynamoDB
- **Autenticación**: JWT + Passport
- **Validación**: Class-validator + DTOs
- **Documentación**: Swagger/OpenAPI

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- Redis (opcional)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd congenial-palm-tree
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del root
npm install

# Instalar dependencias del frontend
cd apps/frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

### 3. Configurar variables de entorno

#### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (.env.local)

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/dutch_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### 4. Configurar base de datos

```bash
# Crear base de datos PostgreSQL
createdb dutch_db

# Ejecutar migraciones (desde el directorio backend)
npm run migration:run
```

### 5. Ejecutar la aplicación

#### Desarrollo

```bash
# Terminal 1: Backend
cd apps/backend
npm run start:dev

# Terminal 2: Frontend
cd apps/frontend
npm run dev
```

#### Producción

```bash
# Construir
npm run build

# Ejecutar
npm run start
```

## 🚀 Uso

1. **Registro/Login**: Accede a `/auth` para crear una cuenta o iniciar sesión
2. **Dashboard**: Visualiza resumen de deudas en `/dashboard`
3. **Gestión de Deudas**: Administra deudas en `/debts`
4. **Nueva Deuda**: Crea deudas desde `/debts/new`

## 🔧 API Endpoints

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login de usuario
- `POST /auth/refresh` - Renovar token

### Deudas

- `GET /debts` - Listar deudas con filtros
- `POST /debts` - Crear nueva deuda
- `GET /debts/:id` - Obtener deuda específica
- `PUT /debts/:id` - Actualizar deuda
- `DELETE /debts/:id` - Eliminar deuda
- `PUT /debts/:id/pay` - Marcar como pagada
- `GET /debts/dashboard/summary` - Resumen del dashboard
- `POST /debts/export` - Exportar deudas

### Usuarios

- `GET /users/me` - Usuario actual
- `GET /users` - Listar usuarios

## 🧪 Testing

```bash
# Frontend
cd apps/frontend
npm run test

# Backend
cd apps/backend
npm run test
```

## 📱 Características de la UI

- **Responsive Design**: Optimizado para móviles y desktop
- **Tema claro**: Interfaz limpia y moderna
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Estados de carga**: Indicadores visuales para operaciones asíncronas
- **Validación en tiempo real**: Feedback inmediato en formularios
- **Modales**: Confirmaciones y formularios en overlays

## 🔒 Seguridad

- **JWT Tokens**: Autenticación segura con refresh tokens
- **Validación**: Validación de entrada en frontend y backend
- **HTTPS**: Recomendado para producción
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Sanitización**: Limpieza de datos de entrada

## 🚀 Despliegue

### Docker

```bash
docker-compose up -d
```

### Vercel (Frontend)

```bash
vercel --prod
```

### Railway/Heroku (Backend)

```bash
# Configurar variables de entorno y deploy
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta a:

- Email: welcome@doublevpartners.com
- Asunto: Prueba Técnica + [Tu nombre]

---

**Desarrollado con ❤️ para la gestión eficiente de deudas entre amigos**
