/**
 * Custom types for debts functionality
 * These types provide better type safety while remaining separate from Prisma
 */

export type DebtStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SortOrder = 'asc' | 'desc';
export type ExportFormat = 'json' | 'csv';

export interface UserBasicInfo {
  id: string;
  fullName: string;
  email: string;
}

export interface DebtBasicData {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: DebtStatus;
  isPaid: boolean;
  creditorId: string;
  debtorId: string;
  dueDate?: Date | null;
  paidAt?: Date | null;
  notes?: string | null;
  category?: string | null;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtWithUsers extends DebtBasicData {
  creditor: UserBasicInfo;
  debtor: UserBasicInfo;
}

export interface DebtFilters {
  status?: DebtStatus;
  isPaid?: boolean;
  priority?: Priority;
  category?: string;
  creditorId?: string;
  debtorId?: string;
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: 'createdAt' | 'amount' | 'dueDate' | 'priority';
  sortOrder?: SortOrder;
}

export interface DebtQuery extends DebtFilters, PaginationParams, SortParams {}

export interface DebtListResult {
  debts: DebtWithUsers[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExportResult {
  filePath: string;
  filename: string;
  contentType: string;
}

export interface ExportStats {
  totalDebts: number;
  availableFilters: string[];
  supportedFormats: string[];
}

export interface SummaryMetric {
  count: number;
  totalAmount: number;
  currency?: string;
}

export interface DebtsByStatus {
  PENDING: SummaryMetric;
  PAID: SummaryMetric;
  OVERDUE: SummaryMetric;
  CANCELLED: SummaryMetric;
}

export interface ActivityMetric {
  count: number;
  totalAmount: number;
}

export interface Last30DaysActivity {
  newDebts: ActivityMetric;
  paidDebts: ActivityMetric;
  overdueDebts: ActivityMetric;
}

export interface CategoryStats {
  category: string;
  count: number;
  totalAmount: number;
}

export interface DashboardSummary {
  totalDebts: SummaryMetric;
  pendingDebts: SummaryMetric;
  paidDebts: SummaryMetric;
  debtsByStatus: DebtsByStatus;
  last30DaysActivity: Last30DaysActivity;
  debtsByCurrency: Record<string, SummaryMetric>;
  topCategories: CategoryStats[];
  generatedAt: Date;
}
