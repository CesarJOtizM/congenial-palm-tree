import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateDebtDto {
  @ApiProperty({
    description: 'Debt description',
    example: 'Dinner at restaurant',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(3)
  description!: string;

  @ApiProperty({
    description: 'Debt amount (always positive)',
    example: 25.5,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Debt currency (ISO 4217)',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string = 'USD';

  @ApiProperty({
    description: 'ID of the creditor user (who lent)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  creditorId!: string;

  @ApiProperty({
    description: 'ID of the debtor user (who owes)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  debtorId!: string;

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
    default: Priority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.MEDIUM;
}
