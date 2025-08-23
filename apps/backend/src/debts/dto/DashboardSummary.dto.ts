import { ApiProperty } from '@nestjs/swagger';

import { DebtStatus } from './CreateDebt.dto';

export class DashboardSummaryDto {
  @ApiProperty({
    description: 'Summary of all debts',
    example: {
      count: 15,
      totalAmount: 1250.75,
      currency: 'USD',
    },
  })
  totalDebts!: {
    count: number;
    totalAmount: number;
    currency: string;
  };

  @ApiProperty({
    description: 'Summary of pending debts (what others owe us)',
    example: {
      count: 8,
      totalAmount: 650.25,
      currency: 'USD',
    },
  })
  pendingDebts!: {
    count: number;
    totalAmount: number;
    currency: string;
  };

  @ApiProperty({
    description: 'Summary of paid debts',
    example: {
      count: 7,
      totalAmount: 600.5,
      currency: 'USD',
    },
  })
  paidDebts!: {
    count: number;
    totalAmount: number;
    currency: string;
  };

  @ApiProperty({
    description: 'Summary of debts by status',
    example: {
      PENDING: { count: 8, totalAmount: 650.25 },
      PAID: { count: 7, totalAmount: 600.5 },
      OVERDUE: { count: 2, totalAmount: 150.0 },
      CANCELLED: { count: 1, totalAmount: 50.0 },
    },
  })
  debtsByStatus!: Record<DebtStatus, { count: number; totalAmount: number }>;

  @ApiProperty({
    description: 'Activity in the last 30 days',
    example: {
      newDebts: { count: 5, totalAmount: 300.0 },
      paidDebts: { count: 3, totalAmount: 200.0 },
      overdueDebts: { count: 1, totalAmount: 75.0 },
    },
  })
  last30DaysActivity!: {
    newDebts: { count: number; totalAmount: number };
    paidDebts: { count: number; totalAmount: number };
    overdueDebts: { count: number; totalAmount: number };
  };

  @ApiProperty({
    description: 'Summary by currency',
    example: {
      USD: { count: 12, totalAmount: 1000.0 },
      EUR: { count: 3, totalAmount: 250.75 },
    },
  })
  debtsByCurrency!: Record<string, { count: number; totalAmount: number }>;

  @ApiProperty({
    description: 'Top 5 debt categories',
    example: [
      { category: 'food', count: 6, totalAmount: 450.0 },
      { category: 'transport', count: 4, totalAmount: 300.0 },
      { category: 'entertainment', count: 3, totalAmount: 200.0 },
      { category: 'services', count: 2, totalAmount: 150.0 },
      { category: 'others', count: 1, totalAmount: 50.0 },
    ],
  })
  topCategories!: Array<{
    category: string;
    count: number;
    totalAmount: number;
  }>;

  @ApiProperty({
    description: 'Summary generation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  generatedAt!: Date;
}
