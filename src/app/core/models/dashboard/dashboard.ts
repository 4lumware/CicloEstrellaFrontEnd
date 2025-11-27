export interface CharData {
  label: string[];
}

export interface CharDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface DashboardKPIs {
  newRegistrationsLast7Days: KPIItem;
  avgRatingLast30Days: KPIItem;
  newReviewsLastNDays: KPIItem;
}

export type KPITrend = 'up' | 'down' | 'neutral';

export interface KPIItem {
  value: number;
  changePercent: number;
  trend: KPITrend;
}
