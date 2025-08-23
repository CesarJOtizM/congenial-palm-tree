import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { DebtStatus, Priority } from './CreateDebt.dto';

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
}

export class ExportDebtsDto {
  @ApiProperty({
    description: 'Export format',
    enum: ExportFormat,
    example: ExportFormat.JSON,
  })
  @IsEnum(ExportFormat)
  format!: ExportFormat;

  @ApiPropertyOptional({
    description: 'Debt status filter',
    enum: DebtStatus,
  })
  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;

  @ApiPropertyOptional({
    description: 'Debt priority filter',
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Debt category filter',
    example: 'food',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Search term in description',
    example: 'dinner',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID of the creditor user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  creditorId?: string;

  @ApiPropertyOptional({
    description: 'ID of the debtor user',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  debtorId?: string;

  @ApiPropertyOptional({
    description: 'Include only paid debts',
    example: false,
  })
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Start date for date range filter (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for date range filter (ISO string)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}
