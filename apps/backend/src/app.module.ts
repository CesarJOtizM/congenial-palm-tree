import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { DebtsModule } from './debts/debts.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    CacheModule,
    HealthModule,
    AuthModule,
    UsersModule,
    DebtsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
