import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';

import { redisConfig } from '../config/env.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: redisConfig.host || 'localhost',
          port: redisConfig.port || 6379,
          maxRetriesPerRequest: 3,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisCacheModule {}
