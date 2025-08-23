import { CacheModule } from '@cache/cache.module';
import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';

import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { ExportService } from './export.service';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [DebtsController],
  providers: [DebtsService, ExportService],
  exports: [DebtsService, ExportService],
})
export class DebtsModule {}
