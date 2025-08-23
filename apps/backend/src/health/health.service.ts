import { CacheService } from '@cache/cache.service';
import { envConfig } from '@config/env.config';
import { PrismaService } from '@database/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    redis: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    const _startTime = Date.now();

    // Verificar base de datos
    const dbCheck = await this.checkDatabase();

    // Verificar Redis
    const redisCheck = await this.checkRedis();

    const overallStatus =
      dbCheck.status === 'ok' && redisCheck.status === 'ok' ? 'ok' : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: envConfig.environment.current || 'development',
      version: '1.0.0',
      checks: {
        database: dbCheck,
        redis: redisCheck,
      },
    };
  }

  async runHealthChecks(): Promise<HealthStatus> {
    return this.checkHealth();
  }

  private async checkDatabase() {
    const startTime = Date.now();

    try {
      // Verificar conexión a la base de datos
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok' as const,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);

      return {
        status: 'error' as const,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkRedis() {
    const startTime = Date.now();

    try {
      // Verificar conexión a Redis
      await this.cache.set('health-check', 'test', 1);
      await this.cache.get('health-check');

      return {
        status: 'ok' as const,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error('Redis health check failed', error);

      return {
        status: 'error' as const,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
