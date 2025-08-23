import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DebtStatus, Priority } from './CreateDebt.dto';

export class DebtResponseDto {
  @ApiProperty({
    description: 'Unique debt ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Debt description',
    example: 'Dinner at restaurant',
  })
  description!: string;

  @ApiProperty({
    description: 'Debt amount',
    example: 25.5,
  })
  amount!: number;

  @ApiProperty({
    description: 'Debt currency',
    example: 'USD',
  })
  currency!: string;

  @ApiProperty({
    description: 'Debt status',
    enum: DebtStatus,
    example: DebtStatus.PENDING,
  })
  status!: DebtStatus;

  @ApiProperty({
    description: 'Indicates if the debt is paid',
    example: false,
  })
  isPaid!: boolean;

  @ApiProperty({
    description: 'ID of the creditor user (who lent)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  creditorId!: string;

  @ApiProperty({
    description: 'ID of the debtor user (who owes)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  debtorId!: string;

  @ApiProperty({
    description: 'Creditor information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'John Doe',
      email: 'john@example.com',
    },
  })
  creditor!: {
    id: string;
    fullName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Debtor information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
    },
  })
  debtor!: {
    id: string;
    fullName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Debt creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Due date',
    example: '2024-12-31T23:59:59.000Z',
  })
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Date when the debt was paid',
    example: '2024-01-20T15:45:00.000Z',
  })
  paidAt?: Date;

  @ApiPropertyOptional({
    description: 'Additional notes about the debt',
    example: 'Pay before end of month',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Debt category',
    example: 'food',
  })
  category?: string;

  @ApiProperty({
    description: 'Debt priority',
    enum: Priority,
    example: Priority.MEDIUM,
  })
  priority!: Priority;
}
