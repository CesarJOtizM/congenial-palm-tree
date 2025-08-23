import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { HealthService, HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<HealthStatus> {
    return this.healthService.runHealthChecks();
  }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  async ping(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async readiness(): Promise<HealthStatus> {
    const health = await this.healthService.checkHealth();

    // Si hay algún error, retornar 503 Service Unavailable
    if (health.status === 'error') {
      throw new Error('Service not ready');
    }

    return health;
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  async liveness(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
