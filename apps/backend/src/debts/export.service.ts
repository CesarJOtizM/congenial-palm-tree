/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { ExportResult, ExportStats } from '@common/types/DebtTypes';
import { PrismaService } from '@database/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

import { ExportDebtsDto, ExportFormat } from './dto/ExportDebts.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Export debts based on filters and format
   */
  async exportDebts(
    exportDto: ExportDebtsDto,
    userId: string
  ): Promise<ExportResult> {
    this.logger.log(
      `Exporting debts for user: ${userId} in format: ${exportDto.format}`
    );

    // Build query filters
    const where: any = {
      OR: [{ creditorId: userId }, { debtorId: userId }],
    };

    if (exportDto.status) {
      where.status = exportDto.status;
    }

    if (exportDto.isPaid !== undefined) {
      where.isPaid = exportDto.isPaid;
    }

    if (exportDto.priority) {
      where.priority = exportDto.priority;
    }

    if (exportDto.category) {
      where.category = exportDto.category;
    }

    if (exportDto.creditorId) {
      where.creditorId = exportDto.creditorId;
    }

    if (exportDto.debtorId) {
      where.debtorId = exportDto.debtorId;
    }

    if (exportDto.search) {
      where.description = {
        contains: exportDto.search,
        mode: 'insensitive',
      };
    }

    if (exportDto.startDate || exportDto.endDate) {
      where.createdAt = {};
      if (exportDto.startDate) {
        where.createdAt.gte = new Date(exportDto.startDate);
      }
      if (exportDto.endDate) {
        where.createdAt.lte = new Date(exportDto.endDate);
      }
    }

    // Get debts with all related data
    const debts = await this.prisma.debt.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    // Transform to response DTOs
    const debtResponses = debts.map(debt => ({
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
    }));

    // Export based on format
    switch (exportDto.format) {
      case ExportFormat.JSON:
        return this.exportToJSON(debtResponses);
      case ExportFormat.CSV:
        return this.exportToCSV(debtResponses);
      default:
        throw new Error(`Unsupported export format: ${exportDto.format}`);
    }
  }

  /**
   * Export debts to JSON format
   */
  private async exportToJSON(debts: any[]): Promise<ExportResult> {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalDebts: debts.length,
      debts: debts,
    };

    const filename = `debts_export_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = path.join(os.tmpdir(), filename);

    // Write to temporary file
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(exportData, null, 2),
      'utf8'
    );

    return {
      filePath,
      filename,
      contentType: 'application/json',
    };
  }

  /**
   * Export debts to CSV format
   */
  private async exportToCSV(debts: any[]): Promise<ExportResult> {
    const filename = `debts_export_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = path.join(os.tmpdir(), filename);

    if (debts.length === 0) {
      // Write empty CSV with headers
      const headers = [
        'ID',
        'Description',
        'Amount',
        'Currency',
        'Status',
        'Is Paid',
        'Creditor ID',
        'Creditor Name',
        'Creditor Email',
        'Debtor ID',
        'Debtor Name',
        'Debtor Email',
        'Created At',
        'Updated At',
        'Due Date',
        'Paid At',
        'Notes',
        'Category',
        'Priority',
      ];
      await fs.promises.writeFile(filePath, headers.join(','), 'utf8');
    } else {
      // Define CSV headers
      const headers = [
        'ID',
        'Description',
        'Amount',
        'Currency',
        'Status',
        'Is Paid',
        'Creditor ID',
        'Creditor Name',
        'Creditor Email',
        'Debtor ID',
        'Debtor Name',
        'Debtor Email',
        'Created At',
        'Updated At',
        'Due Date',
        'Paid At',
        'Notes',
        'Category',
        'Priority',
      ];

      // Build CSV content
      const csvRows = [headers.join(',')];

      debts.forEach(debt => {
        const row = [
          debt.id,
          `"${debt.description.replace(/"/g, '""')}"`, // Escape quotes in description
          debt.amount,
          debt.currency,
          debt.status,
          debt.isPaid,
          debt.creditorId,
          `"${debt.creditor.fullName.replace(/"/g, '""')}"`,
          debt.creditor.email,
          debt.debtorId,
          `"${debt.debtor.fullName.replace(/"/g, '""')}"`,
          debt.debtor.email,
          debt.createdAt.toISOString(),
          debt.updatedAt.toISOString(),
          debt.dueDate ? debt.dueDate.toISOString() : '',
          debt.paidAt ? debt.paidAt.toISOString() : '',
          debt.notes ? `"${debt.notes.replace(/"/g, '""')}"` : '',
          debt.category || '',
          debt.priority,
        ];

        csvRows.push(row.join(','));
      });

      // Write to temporary file
      await fs.promises.writeFile(filePath, csvRows.join('\n'), 'utf8');
    }

    return {
      filePath,
      filename,
      contentType: 'text/csv',
    };
  }

  /**
   * Clean up temporary file after download
   */
  async cleanupTempFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      this.logger.log(`Temporary file cleaned up: ${filePath}`);
    } catch (error) {
      this.logger.warn(`Failed to cleanup temporary file: ${filePath}`, error);
    }
  }

  /**
   * Get export statistics
   */
  async getExportStats(userId: string): Promise<ExportStats> {
    const totalDebts = await this.prisma.debt.count({
      where: {
        OR: [{ creditorId: userId }, { debtorId: userId }],
      },
    });

    return {
      totalDebts,
      availableFilters: [
        'status',
        'priority',
        'category',
        'search',
        'creditorId',
        'debtorId',
        'isPaid',
        'startDate',
        'endDate',
      ],
      supportedFormats: ['json', 'csv'],
    };
  }
}
