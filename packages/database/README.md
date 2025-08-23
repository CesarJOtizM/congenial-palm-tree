# @deudas-app/database

Paquete de base de datos para la aplicación de gestión de deudas, basado en Prisma con PostgreSQL.

## 🚀 Características

- **Cliente Prisma preconfigurado** con manejo de conexiones
- **Modelos de datos** para usuarios, deudas, eventos de dominio y auditoría
- **Tipos TypeScript** completamente tipados
- **Compatibilidad universal** con proyectos Node.js y TypeScript
- **Manejo automático de conexiones** en desarrollo y producción

## 📦 Instalación

```bash
npm install @deudas-app/database
# o
yarn add @deudas-app/database
# o
bun add @deudas-app/database
```

## 🔧 Uso

### Importación básica

```typescript
import { client } from '@deudas-app/database';

// El cliente ya está conectado automáticamente
const users = await client.user.findMany();
```

### Importación de tipos

```typescript
import { User, Debt, PrismaClient } from '@deudas-app/database';

// Usar tipos en tu código
const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'usuario@example.com',
  password: 'hashedPassword',
  fullName: 'Usuario Ejemplo',
  isActive: true,
};
```

### Uso en diferentes entornos

El paquete maneja automáticamente las conexiones:

- **Desarrollo**: Reutiliza la conexión global para evitar múltiples conexiones
- **Producción**: Crea una nueva conexión por instancia

## 🗄️ Modelos disponibles

### User

- Gestión de usuarios con autenticación
- Relaciones con deudas (acreedor/deudor)
- Logs de auditoría

### Debt

- Gestión de deudas entre usuarios
- Estados: PENDING, PAID, OVERDUE, CANCELLED
- Prioridades: LOW, MEDIUM, HIGH, URGENT
- Categorías y fechas de vencimiento

### DomainEvent

- Eventos de dominio para arquitectura limpia
- Procesamiento asíncrono

### AuditLog

- Trazabilidad completa de cambios
- Información de usuario, IP y user agent

## 🛠️ Desarrollo

### Compilar el paquete

```bash
cd packages/database
npm run build
```

### Scripts disponibles

- `npm run build` - Compila el paquete
- `npm run dev` - Compilación en modo watch
- `npm run clean` - Limpia el directorio dist
- `npm run generate` - Genera el cliente Prisma
- `npm run db:push` - Sincroniza la base de datos
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:seed` - Pobla la base de datos con datos de ejemplo

## 📁 Estructura del paquete

```
dist/
├── index.js          # Punto de entrada principal
├── index.d.ts        # Tipos TypeScript
├── generated/        # Cliente Prisma generado
└── prisma/          # Esquema y migraciones
```

## 🔒 Variables de entorno requeridas

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/deudas_db"
```

## 📚 Ejemplos

### Crear un usuario

```typescript
import { client } from '@deudas-app/database';
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash('password123', 10);

const user = await client.user.create({
  data: {
    email: 'nuevo@example.com',
    password: hashedPassword,
    fullName: 'Nuevo Usuario',
    isActive: true,
  },
});
```

### Crear una deuda

```typescript
import { client } from '@deudas-app/database';

const debt = await client.debt.create({
  data: {
    description: 'Almuerzo compartido',
    amount: 25.5,
    currency: 'USD',
    creditorId: 'id-del-acreedor',
    debtorId: 'id-del-deudor',
    category: 'Comida',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
  },
});
```

### Consultar deudas pendientes

```typescript
import { client } from '@deudas-app/database';

const pendingDebts = await client.debt.findMany({
  where: {
    isPaid: false,
    status: 'PENDING',
  },
  include: {
    creditor: true,
    debtor: true,
  },
});
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para más detalles.
