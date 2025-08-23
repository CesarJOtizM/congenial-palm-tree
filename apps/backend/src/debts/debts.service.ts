/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheService } from '@cache/cache.service';
import { DebtListResult, DebtWithUsers } from '@common/types/DebtTypes';
import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateDebtDto, DebtStatus, Priority } from './dto/CreateDebt.dto';
import { DashboardSummaryDto } from './dto/DashboardSummary.dto';
import { DebtQueryDto } from './dto/DebtQuery.dto';
import { DebtResponseDto } from './dto/DebtResponse.dto';
import { UpdateDebtDto } from './dto/UpdateDebt.dto';

@Injectable()
export class DebtsService {
  private readonly logger = new Logger(DebtsService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  /**
   * Create a new debt
   */
  async createDebt(
    createDebtDto: CreateDebtDto,
    userId: string
  ): Promise<DebtResponseDto> {
    this.logger.log(
      `Creating debt: ${createDebtDto.description} for user: ${userId}`
    );

    // Validate that user cannot create debts with themselves
    if (createDebtDto.creditorId === createDebtDto.debtorId) {
      throw new BadRequestException(
        'Creditor and debtor cannot be the same person'
      );
    }

    // Validate that the user creating the debt is the creditor
    if (createDebtDto.creditorId !== userId) {
      throw new ForbiddenException(
        'You can only create debts where you are the creditor'
      );
    }

    // Verify that both users exist
    const [creditor, debtor] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: createDebtDto.creditorId } }),
      this.prisma.user.findUnique({ where: { id: createDebtDto.debtorId } }),
    ]);

    if (!creditor || !debtor) {
      throw new NotFoundException('Creditor or debtor not found');
    }

    // Create the debt
    const debt = await this.prisma.debt.create({
      data: {
        description: createDebtDto.description,
        amount: createDebtDto.amount,
        currency: createDebtDto.currency || 'USD',
        creditorId: createDebtDto.creditorId,
        debtorId: createDebtDto.debtorId,
        dueDate: createDebtDto.dueDate,
        notes: createDebtDto.notes,
        category: createDebtDto.category,
        priority: createDebtDto.priority || Priority.MEDIUM,
        status: DebtStatus.PENDING,
        isPaid: false,
      },
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Invalidate dashboard cache
    await this.invalidateDashboardCache();

    this.logger.log(`Debt created successfully: ${debt.id}`);
    return this.mapToDebtResponse(debt);
  }

  /**
   * Get all debts with filters and pagination
   */
  async getAllDebts(
    query: DebtQueryDto,
    userId: string
  ): Promise<DebtListResult> {
    this.logger.log(
      `Getting debts for user: ${userId} with filters: ${JSON.stringify(query)}`
    );

    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build query filters
    const where: any = {
      OR: [{ creditorId: userId }, { debtorId: userId }],
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.isPaid !== undefined) {
      where.isPaid = filters.isPaid;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.creditorId) {
      where.creditorId = filters.creditorId;
    }

    if (filters.debtorId) {
      where.debtorId = filters.debtorId;
    }

    if (filters.search) {
      where.description = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    // Build ordering
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (
      filters.sortBy &&
      ['createdAt', 'amount', 'dueDate', 'priority'].includes(filters.sortBy)
    ) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Execute queries
    const [debts, total] = await Promise.all([
      this.prisma.debt.findMany({
        where,
        include: {
          creditor: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          debtor: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.debt.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      debts: debts.map(debt => this.mapToDebtResponse(debt)) as DebtWithUsers[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get a debt by ID
   */
  async getDebtById(id: string, userId: string): Promise<DebtResponseDto> {
    this.logger.log(`Getting debt: ${id} for user: ${userId}`);

    const debt = await this.prisma.debt.findUnique({
      where: { id },
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    // Verify that the user has access to this debt
    if (debt.creditorId !== userId && debt.debtorId !== userId) {
      throw new ForbiddenException('You do not have access to this debt');
    }

    return this.mapToDebtResponse(debt);
  }

  /**
   * Update a debt
   */
  async updateDebt(
    id: string,
    updateDebtDto: UpdateDebtDto,
    userId: string
  ): Promise<DebtResponseDto> {
    this.logger.log(`Updating debt: ${id} for user: ${userId}`);

    const debt = await this.prisma.debt.findUnique({
      where: { id },
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    // Verify that the user is the creditor (only creditor can modify)
    if (debt.creditorId !== userId) {
      throw new ForbiddenException('Only the creditor can modify this debt');
    }

    // Validate that paid debts cannot be modified
    if (debt.isPaid && (updateDebtDto.amount || updateDebtDto.description)) {
      throw new BadRequestException('Cannot modify paid debts');
    }

    // If marking as paid, update related fields
    if (updateDebtDto.status === DebtStatus.PAID && !debt.isPaid) {
      updateDebtDto.isPaid = true;
      updateDebtDto.paidAt = new Date();
    }

    // Update the debt
    const updatedDebt = await this.prisma.debt.update({
      where: { id },
      data: updateDebtDto,
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Invalidate dashboard cache
    await this.invalidateDashboardCache();

    this.logger.log(`Debt updated successfully: ${id}`);
    return this.mapToDebtResponse(updatedDebt);
  }

  /**
   * Mark debt as paid
   */
  async markAsPaid(id: string, userId: string): Promise<DebtResponseDto> {
    this.logger.log(`Marking debt as paid: ${id} for user: ${userId}`);

    const debt = await this.prisma.debt.findUnique({
      where: { id },
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    // Verify that the user is the creditor
    if (debt.creditorId !== userId) {
      throw new ForbiddenException(
        'Only the creditor can mark this debt as paid'
      );
    }

    if (debt.isPaid) {
      throw new BadRequestException('Debt is already marked as paid');
    }

    const updatedDebt = await this.prisma.debt.update({
      where: { id },
      data: {
        isPaid: true,
        status: DebtStatus.PAID,
        paidAt: new Date(),
      },
      include: {
        creditor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        debtor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Invalidate dashboard cache
    await this.invalidateDashboardCache();

    this.logger.log(`Debt marked as paid: ${id}`);
    return this.mapToDebtResponse(updatedDebt);
  }

  /**
   * Delete a debt
   */
  async deleteDebt(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting debt: ${id} for user: ${userId}`);

    const debt = await this.prisma.debt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    // Verify that the user is the creditor
    if (debt.creditorId !== userId) {
      throw new ForbiddenException('Only the creditor can delete this debt');
    }

    // Validate that paid debts cannot be deleted
    if (debt.isPaid) {
      throw new BadRequestException('Cannot delete paid debts');
    }

    await this.prisma.debt.delete({
      where: { id },
    });

    // Invalidate dashboard cache
    await this.invalidateDashboardCache();

    this.logger.log(`Debt deleted successfully: ${id}`);
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(userId: string): Promise<DashboardSummaryDto> {
    this.logger.log(`Getting dashboard summary for user: ${userId}`);

    // Try to get from cache first
    const cacheKey = `dashboard_summary:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached as DashboardSummaryDto;
    }

    // Get all user debts
    const userDebts = await this.prisma.debt.findMany({
      where: {
        OR: [{ creditorId: userId }, { debtorId: userId }],
      },
    });

    // Calculate metrics
    const totalDebts = {
      count: userDebts.length,
      totalAmount: userDebts.reduce(
        (sum, debt) => sum + Number(debt.amount),
        0
      ),
      currency: 'USD', // For now we assume USD as main currency
    };

    const pendingDebts = userDebts.filter(debt => !debt.isPaid);
    const pendingDebtsSummary = {
      count: pendingDebts.length,
      totalAmount: pendingDebts.reduce(
        (sum, debt) => sum + Number(debt.amount),
        0
      ),
      currency: 'USD',
    };

    const paidDebts = userDebts.filter(debt => debt.isPaid);
    const paidDebtsSummary = {
      count: paidDebts.length,
      totalAmount: paidDebts.reduce(
        (sum, debt) => sum + Number(debt.amount),
        0
      ),
      currency: 'USD',
    };

    // Debts by status
    const debtsByStatus = {
      PENDING: { count: 0, totalAmount: 0 },
      PAID: { count: 0, totalAmount: 0 },
      OVERDUE: { count: 0, totalAmount: 0 },
      CANCELLED: { count: 0, totalAmount: 0 },
    };

    userDebts.forEach(debt => {
      const status = debt.status as DebtStatus;
      debtsByStatus[status].count++;
      debtsByStatus[status].totalAmount += Number(debt.amount);
    });

    // Activity in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDebts = userDebts.filter(
      debt => debt.createdAt >= thirtyDaysAgo
    );
    const recentPaidDebts = userDebts.filter(
      debt => debt.paidAt && debt.paidAt >= thirtyDaysAgo
    );

    const last30DaysActivity = {
      newDebts: {
        count: recentDebts.length,
        totalAmount: recentDebts.reduce(
          (sum, debt) => sum + Number(debt.amount),
          0
        ),
      },
      paidDebts: {
        count: recentPaidDebts.length,
        totalAmount: recentPaidDebts.reduce(
          (sum, debt) => sum + Number(debt.amount),
          0
        ),
      },
      overdueDebts: {
        count: userDebts.filter(debt => debt.status === DebtStatus.OVERDUE)
          .length,
        totalAmount: userDebts
          .filter(debt => debt.status === DebtStatus.OVERDUE)
          .reduce((sum, debt) => sum + Number(debt.amount), 0),
      },
    };

    // Summary by currency
    const debtsByCurrency: Record<
      string,
      { count: number; totalAmount: number }
    > = {};
    userDebts.forEach(debt => {
      const currency = debt.currency || 'USD';
      if (!debtsByCurrency[currency]) {
        debtsByCurrency[currency] = { count: 0, totalAmount: 0 };
      }
      debtsByCurrency[currency]!.count++;
      debtsByCurrency[currency]!.totalAmount += Number(debt.amount);
    });

    // Top 5 categories
    const categoryStats: Record<
      string,
      { count: number; totalAmount: number }
    > = {};
    userDebts.forEach(debt => {
      const category = debt.category || 'uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, totalAmount: 0 };
      }
      categoryStats[category]!.count++;
      categoryStats[category]!.totalAmount += Number(debt.amount);
    });

    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        totalAmount: stats.totalAmount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);

    const summary: DashboardSummaryDto = {
      totalDebts,
      pendingDebts: pendingDebtsSummary,
      paidDebts: paidDebtsSummary,
      debtsByStatus,
      last30DaysActivity,
      debtsByCurrency,
      topCategories,
      generatedAt: new Date(),
    };

    // Save to cache
    await this.cacheService.set(cacheKey, summary, this.CACHE_TTL);

    return summary;
  }

  /**
   * Invalidate dashboard cache
   */
  private async invalidateDashboardCache(): Promise<void> {
    try {
      const keys = await this.cacheService.getKeys('dashboard_summary:*');
      if (keys.length > 0) {
        await Promise.all(keys.map(key => this.cacheService.del(key)));
        this.logger.log('Dashboard cache invalidated');
      }
    } catch (error) {
      this.logger.warn('Failed to invalidate dashboard cache', error);
    }
  }

  /**
   * Map debt from Prisma to response DTO
   */
  private mapToDebtResponse(debt: any): DebtResponseDto {
    return {
      id: debt.id,
      description: debt.description,
      amount: Number(debt.amount),
      currency: debt.currency,
      status: debt.status,
      isPaid: debt.isPaid,
      creditorId: debt.creditorId,
      debtorId: debt.debtorId,
      creditor: debt.creditor,
      debtor: debt.debtor,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
      dueDate: debt.dueDate,
      paidAt: debt.paidAt,
      notes: debt.notes,
      category: debt.category,
      priority: debt.priority,
    };
  }
}
