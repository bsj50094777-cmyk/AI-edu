export type Sector = 'IT' | '바이오' | '에너지' | '소비재';

export interface StockHolding {
  id: string;
  ticker: string;
  name: string;
  sector: Sector;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  previousClose: number;
  notes?: string;
}

export interface MonthlyRecord {
  id: string;
  month: string; // e.g. "2026-01"
  monthLabel: string; // e.g. "2026년 1월"
  startValue: number;
  endValue: number;
  netProfit: number;
  returnRate: number; // percentage
  marketIndex: number; // e.g. S&P 500 equivalent
}

export type TabType = 'overview' | 'prices' | 'sectors' | 'profit' | 'monthly' | 'ai-analysis';
