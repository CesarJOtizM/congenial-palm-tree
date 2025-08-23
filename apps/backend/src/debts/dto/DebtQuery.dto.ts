import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { DebtStatus, Priority } from './CreateDebt.dto';

export class DebtQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Debt status',
    enum: DebtStatus,
  })
  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;

  @ApiPropertyOptional({
    description: 'Indicates if the debt is paid',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Debt priority',
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Debt category',
    example: 'food',
  })
  @IsOptional()
  @IsString()
  category?: string;

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
    description: 'Search term in description',
    example: 'dinner',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['createdAt', 'amount', 'dueDate', 'priority'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
