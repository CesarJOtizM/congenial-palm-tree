/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthService } from '@/health/health.service';

// Mock de las dependencias
const mockPrismaService = {
  $queryRaw: vi.fn(),
};

const mockCacheService = {
  set: vi.fn(),
  get: vi.fn(),
};

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    // Crear el módulo de prueba con mocks simples
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthService,
          useFactory: () => {
            const healthService = new HealthService(
              mockPrismaService as any,
              mockCacheService as any
            );
            return healthService;
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);

    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks();
  });

  describe('checkHealth', () => {
    it('should return health status successfully when all services are healthy', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      const expectedStatus = {
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: '1.0.0',
        checks: {
          database: {
            status: 'ok',
            responseTime: expect.any(Number),
          },
          redis: {
            status: 'ok',
            responseTime: expect.any(Number),
          },
        },
      };

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result).toMatchObject(expectedStatus);
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
      expect(result.uptime).toBeGreaterThan(0);
      expect(result.checks.database.status).toBe('ok');
      expect(result.checks.redis.status).toBe('ok');
    });

    it('should return error status when database is unhealthy', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrismaService.$queryRaw.mockRejectedValue(dbError);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.status).toBe('error');
      expect(result.checks.database.status).toBe('error');
      expect(result.checks.database.error).toBe('Database connection failed');
      expect(result.checks.redis.status).toBe('ok');
    });

    it('should return error status when Redis is unhealthy', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      const redisError = new Error('Redis connection failed');
      mockCacheService.set.mockRejectedValue(redisError);

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.status).toBe('error');
      expect(result.checks.database.status).toBe('ok');
      expect(result.checks.redis.status).toBe('error');
      expect(result.checks.redis.error).toBe('Redis connection failed');
    });

    it('should return valid timestamp', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.checkHealth();
      const timestamp = new Date(result.timestamp);

      // Assert
      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should return valid uptime', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.uptime).toBeGreaterThan(0);
      expect(typeof result.uptime).toBe('number');
    });

    it('should return valid environment', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.environment).toBeDefined();
      expect(typeof result.environment).toBe('string');
    });

    it('should return valid version', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.version).toBe('1.0.0');
      expect(typeof result.version).toBe('string');
    });
  });

  describe('runHealthChecks', () => {
    it('should call checkHealth method', async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([{ '1': 1 }]);
      mockCacheService.set.mockResolvedValue('OK');
      mockCacheService.get.mockResolvedValue('test');

      // Act
      const result = await service.runHealthChecks();

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
    });
  });
});
