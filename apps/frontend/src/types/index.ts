export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Debt {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  isPaid: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  dueDate?: string;
  creditorId: string;
  debtorId: string;
  creditor: User;
  debtor: User;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  notes?: string;
}

export interface CreateDebtRequest {
  description: string;
  amount: number;
  currency: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  dueDate?: string;
  creditorId: string;
  debtorId: string;
  notes?: string;
}

export interface UpdateDebtRequest {
  description?: string;
  amount?: number;
  currency?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  dueDate?: string;
}

export interface DebtQuery {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  isPaid?: boolean;
  overdue?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardSummary {
  totalDebts: {
    count: number;
    totalAmount: number;
    currency: string;
  };
  pendingDebts: {
    count: number;
    totalAmount: number;
    currency: string;
  };
  paidDebts: {
    count: number;
    totalAmount: number;
    currency: string;
  };
  debtsByStatus: {
    PENDING: {
      count: number;
      totalAmount: number;
    };
    PAID: {
      count: number;
      totalAmount: number;
    };
    OVERDUE: {
      count: number;
      totalAmount: number;
    };
    CANCELLED: {
      count: number;
      totalAmount: number;
    };
  };
  last30DaysActivity: {
    newDebts: {
      count: number;
      totalAmount: number;
    };
    paidDebts: {
      count: number;
      totalAmount: number;
    };
    overdueDebts: {
      count: number;
      totalAmount: number;
    };
  };
  debtsByCurrency: Record<
    string,
    {
      count: number;
      totalAmount: number;
    }
  >;
  topCategories: Array<{
    category: string;
    count: number;
    totalAmount: number;
  }>;
  generatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DebtsPaginatedResponse {
  debts: Debt[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersPaginatedResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
