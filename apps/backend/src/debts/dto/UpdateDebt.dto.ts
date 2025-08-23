import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { DebtStatus, Priority } from './CreateDebt.dto';

export class UpdateDebtDto {
  @ApiPropertyOptional({
    description: 'Debt description',
    example: 'Updated dinner at restaurant',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @MinLength(3)
  description?: string;

  @ApiPropertyOptional({
    description: 'Debt amount (always positive)',
    example: 30.0,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Debt currency (ISO 4217)',
    example: 'USD',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Optional due date',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Additional notes about the debt',
    example: 'Pay before end of month',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Debt category',
    example: 'food',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: 'Debt priority',
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Debt status',
    enum: DebtStatus,
  })
  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;

  @ApiPropertyOptional({
    description: 'Whether the debt is paid',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Date when the debt was paid',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  paidAt?: Date;
}
