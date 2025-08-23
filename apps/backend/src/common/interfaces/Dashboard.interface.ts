export interface ISummaryMetric {
  count: number;
  totalAmount: number;
  currency?: string;
}

export interface IDebtsByStatus {
  PENDING: ISummaryMetric;
  PAID: ISummaryMetric;
  OVERDUE: ISummaryMetric;
  CANCELLED: ISummaryMetric;
}

export interface IActivityMetric {
  count: number;
  totalAmount: number;
}

export interface ILast30DaysActivity {
  newDebts: IActivityMetric;
  paidDebts: IActivityMetric;
  overdueDebts: IActivityMetric;
}

export interface ICategoryStats {
  category: string;
  count: number;
  totalAmount: number;
}

export interface IDashboardSummary {
  totalDebts: ISummaryMetric;
  pendingDebts: ISummaryMetric;
  paidDebts: ISummaryMetric;
  debtsByStatus: IDebtsByStatus;
  last30DaysActivity: ILast30DaysActivity;
  debtsByCurrency: Record<string, ISummaryMetric>;
  topCategories: ICategoryStats[];
  generatedAt: Date;
}
