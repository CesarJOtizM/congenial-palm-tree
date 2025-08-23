import * as bcrypt from 'bcrypt';

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.auditLog.deleteMany();
  await prisma.domainEvent.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  console.log('👥 Creando usuarios de ejemplo...');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'juan@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Juan Pérez',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'María García',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Carlos López',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Ana Martínez',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'pedro@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Pedro Rodríguez',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${users.length} usuarios creados`);

  // Crear deudas de ejemplo
  console.log('💰 Creando deudas de ejemplo...');

  const debts = await Promise.all([
    // Juan le debe a María
    prisma.debt.create({
      data: {
        description: 'Almuerzo en el restaurante italiano',
        amount: 25.5,
        currency: 'USD',
        isPaid: false,
        status: 'PENDING',
        creditorId: users[1].id, // María
        debtorId: users[0].id, // Juan
        category: 'Comida',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        notes: 'Almuerzo del viernes pasado, muy rico!',
      },
    }),

    // Carlos le debe a Ana
    prisma.debt.create({
      data: {
        description: 'Gasolina para el viaje a la playa',
        amount: 45.0,
        currency: 'USD',
        isPaid: false,
        status: 'PENDING',
        creditorId: users[3].id, // Ana
        debtorId: users[2].id, // Carlos
        category: 'Transporte',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
        notes: 'Viaje del fin de semana, compartimos el auto',
      },
    }),

    // Pedro le debe a Juan
    prisma.debt.create({
      data: {
        description: 'Entradas para el concierto',
        amount: 80.0,
        currency: 'USD',
        isPaid: false,
        status: 'PENDING',
        creditorId: users[0].id, // Juan
        debtorId: users[4].id, // Pedro
        category: 'Entretenimiento',
        priority: 'URGENT',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 día
        notes: 'Concierto de rock, ¡va a estar increíble!',
      },
    }),

    // María le debe a Carlos (deuda pagada)
    prisma.debt.create({
      data: {
        description: 'Cena en el bar',
        amount: 35.75,
        currency: 'USD',
        isPaid: true,
        status: 'PAID',
        creditorId: users[2].id, // Carlos
        debtorId: users[1].id, // María
        category: 'Comida',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Pagada hace 2 días
        notes: 'Cena del sábado, ya pagué por transferencia',
      },
    }),

    // Ana le debe a Pedro
    prisma.debt.create({
      data: {
        description: 'Libro de programación',
        amount: 55.25,
        currency: 'USD',
        isPaid: false,
        status: 'PENDING',
        creditorId: users[4].id, // Pedro
        debtorId: users[3].id, // Ana
        category: 'Educación',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        notes: 'Libro de TypeScript avanzado, muy útil para el trabajo',
      },
    }),
  ]);

  console.log(`✅ ${debts.length} deudas creadas`);

  // Crear eventos de dominio de ejemplo
  console.log('📡 Creando eventos de dominio de ejemplo...');

  const domainEvents = await Promise.all([
    prisma.domainEvent.create({
      data: {
        type: 'USER_REGISTERED',
        payload: {
          userId: users[0].id,
          email: users[0].email,
          fullName: users[0].fullName,
        },
        entityType: 'User',
        entityId: users[0].id,
        eventSource: 'auth-service',
        isProcessed: true,
      },
    }),
    prisma.domainEvent.create({
      data: {
        type: 'DEBT_CREATED',
        payload: {
          debtId: debts[0].id,
          amount: debts[0].amount,
          creditorId: debts[0].creditorId,
          debtorId: debts[0].debtorId,
        },
        entityType: 'Debt',
        entityId: debts[0].id,
        eventSource: 'debt-service',
        isProcessed: true,
      },
    }),
    prisma.domainEvent.create({
      data: {
        type: 'DEBT_PAID',
        payload: {
          debtId: debts[3].id,
          paidAt: debts[3].paidAt,
          amount: debts[3].amount,
        },
        entityType: 'Debt',
        entityId: debts[3].id,
        eventSource: 'debt-service',
        isProcessed: true,
      },
    }),
  ]);

  console.log(`✅ ${domainEvents.length} eventos de dominio creados`);

  // Crear logs de auditoría de ejemplo
  console.log('📝 Creando logs de auditoría de ejemplo...');

  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: users[0].id,
        action: 'CREATE',
        entityType: 'User',
        entityId: users[0].id,
        newValues: {
          email: users[0].email,
          fullName: users[0].fullName,
        },
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[1].id,
        action: 'CREATE',
        entityType: 'Debt',
        entityId: debts[0].id,
        newValues: {
          description: debts[0].description,
          amount: debts[0].amount,
          creditorId: debts[0].creditorId,
          debtorId: debts[0].debtorId,
        },
        ipAddress: '192.168.1.101',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[2].id,
        action: 'UPDATE',
        entityType: 'Debt',
        entityId: debts[3].id,
        oldValues: {
          isPaid: false,
          status: 'PENDING',
        },
        newValues: {
          isPaid: true,
          status: 'PAID',
          paidAt: debts[3].paidAt,
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    }),
  ]);

  console.log(`✅ ${auditLogs.length} logs de auditoría creados`);

  // Mostrar resumen
  console.log('\n📊 Resumen del seed:');
  console.log(`👥 Usuarios: ${users.length}`);
  console.log(`💰 Deudas: ${debts.length}`);
  console.log(`📡 Eventos de dominio: ${domainEvents.length}`);
  console.log(`📝 Logs de auditoría: ${auditLogs.length}`);

  console.log('\n🎯 Datos de acceso para testing:');
  console.log('📧 Email: juan@example.com | 🔑 Password: password123');
  console.log('📧 Email: maria@example.com | 🔑 Password: password123');
  console.log('📧 Email: carlos@example.com | 🔑 Password: password123');
  console.log('📧 Email: ana@example.com | 🔑 Password: password123');
  console.log('📧 Email: pedro@example.com | 🔑 Password: password123');

  console.log('\n✅ Seed completado exitosamente!');
}

main()
  .catch(e => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
