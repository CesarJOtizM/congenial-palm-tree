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

export interface IUserMin {
  id: string;
  fullName: string;
  email: string;
}

export interface IDebt {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: DebtStatus;
  isPaid: boolean;
  creditorId: string;
  debtorId: string;
  dueDate?: Date;
  paidAt?: Date;
  notes?: string;
  category?: string;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDebtWithUsers extends IDebt {
  creditor: IUserMin;
  debtor: IUserMin;
}

export interface IDebtCreate {
  description: string;
  amount: number;
  currency?: string;
  creditorId: string;
  debtorId: string;
  dueDate?: Date;
  notes?: string;
  category?: string;
  priority?: Priority;
}

export interface IDebtUpdate {
  description?: string;
  amount?: number;
  currency?: string;
  status?: DebtStatus;
  isPaid?: boolean;
  dueDate?: Date;
  paidAt?: Date;
  notes?: string;
  category?: string;
  priority?: Priority;
}

export interface IDebtFilters {
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

export interface IDebtQuery extends IDebtFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface IDebtListResponse {
  debts: IDebtWithUsers[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface ISortParams {
  [key: string]: 'asc' | 'desc';
}

export interface IWhereClause {
  OR?: Array<{
    creditorId?: string;
    debtorId?: string;
  }>;
  status?: DebtStatus;
  isPaid?: boolean;
  priority?: Priority;
  category?: string;
  creditorId?: string;
  debtorId?: string;
  description?: {
    contains: string;
    mode: 'insensitive' | 'sensitive';
  };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface IDebtExportData {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  isPaid: boolean;
  creditorId: string;
  debtorId: string;
  creditor: IUserMin;
  debtor: IUserMin;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
  paidAt?: Date | null;
  notes?: string | null;
  category?: string | null;
  priority: string;
}

export interface IExportResult {
  filePath: string;
  filename: string;
  contentType: string;
}

export interface IExportStats {
  totalDebts: number;
  availableFilters: string[];
  supportedFormats: string[];
}
