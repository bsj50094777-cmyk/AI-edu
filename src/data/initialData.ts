import { StockHolding, MonthlyRecord } from '../types';

export const INITIAL_HOLDINGS: StockHolding[] = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'IT',
    shares: 45,
    purchasePrice: 175.50,
    currentPrice: 228.40,
    previousClose: 225.10,
    notes: 'Long-term core tech holding'
  },
  {
    id: '2',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'IT',
    shares: 30,
    purchasePrice: 110.20,
    currentPrice: 135.80,
    previousClose: 132.40,
    notes: 'AI semiconductor leader'
  },
  {
    id: '3',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'IT',
    shares: 25,
    purchasePrice: 380.00,
    currentPrice: 432.10,
    previousClose: 428.50,
    notes: 'Cloud & AI enterprise'
  },
  {
    id: '4',
    ticker: 'LLY',
    name: 'Eli Lilly and Company',
    sector: '바이오',
    shares: 10,
    purchasePrice: 780.00,
    currentPrice: 915.50,
    previousClose: 902.00,
    notes: 'Pharmaceuticals & weight loss therapeutics'
  },
  {
    id: '5',
    ticker: 'UNH',
    name: 'UnitedHealth Group Inc.',
    sector: '바이오',
    shares: 15,
    purchasePrice: 490.00,
    currentPrice: 545.20,
    previousClose: 550.00,
    notes: 'Healthcare insurance & services'
  },
  {
    id: '6',
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: '에너지',
    shares: 40,
    purchasePrice: 105.00,
    currentPrice: 118.30,
    previousClose: 117.50,
    notes: 'Global energy & oil major'
  },
  {
    id: '7',
    ticker: 'CVX',
    name: 'Chevron Corporation',
    sector: '에너지',
    shares: 25,
    purchasePrice: 150.00,
    currentPrice: 158.40,
    previousClose: 157.10,
    notes: 'Integrated energy producer'
  },
  {
    id: '8',
    ticker: 'PG',
    name: 'Procter & Gamble Co.',
    sector: '소비재',
    shares: 35,
    purchasePrice: 155.00,
    currentPrice: 169.80,
    previousClose: 168.90,
    notes: 'Consumer staples dividend king'
  },
  {
    id: '9',
    ticker: 'KO',
    name: 'The Coca-Cola Company',
    sector: '소비재',
    shares: 60,
    purchasePrice: 60.00,
    currentPrice: 68.20,
    previousClose: 67.90,
    notes: 'Global beverage giant'
  },
  {
    id: '10',
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: '소비재',
    shares: 20,
    purchasePrice: 170.00,
    currentPrice: 198.50,
    previousClose: 195.20,
    notes: 'E-commerce and AWS cloud'
  }
];

export const INITIAL_MONTHLY_RECORDS: MonthlyRecord[] = [
  { id: 'm1', month: '2025-09', monthLabel: '2025년 9월', startValue: 35000, endValue: 36200, netProfit: 1200, returnRate: 3.43, marketIndex: 5700 },
  { id: 'm2', month: '2025-10', monthLabel: '2025년 10월', startValue: 36200, endValue: 35400, netProfit: -800, returnRate: -2.21, marketIndex: 5580 },
  { id: 'm3', month: '2025-11', monthLabel: '2025년 11월', startValue: 35400, endValue: 38900, netProfit: 3500, returnRate: 9.89, marketIndex: 5920 },
  { id: 'm4', month: '2025-12', monthLabel: '2025년 12월', startValue: 38900, endValue: 40100, netProfit: 1200, returnRate: 3.08, marketIndex: 6040 },
  { id: 'm5', month: '2026-01', monthLabel: '2026년 1월', startValue: 40100, endValue: 41800, netProfit: 1700, returnRate: 4.24, marketIndex: 6150 },
  { id: 'm6', month: '2026-02', monthLabel: '2026년 2월', startValue: 41800, endValue: 40500, netProfit: -1300, returnRate: -3.11, marketIndex: 5990 },
  { id: 'm7', month: '2026-03', monthLabel: '2026년 3월', startValue: 40500, endValue: 43200, netProfit: 2700, returnRate: 6.67, marketIndex: 6280 },
  { id: 'm8', month: '2026-04', monthLabel: '2026년 4월', startValue: 43200, endValue: 42100, netProfit: -1100, returnRate: -2.55, marketIndex: 6190 },
  { id: 'm9', month: '2026-05', monthLabel: '2026년 5월', startValue: 42100, endValue: 45600, netProfit: 3500, returnRate: 8.31, marketIndex: 6450 },
  { id: 'm10', month: '2026-06', monthLabel: '2026년 6월', startValue: 45600, endValue: 47800, netProfit: 2200, returnRate: 4.82, marketIndex: 6620 },
  { id: 'm11', month: '2026-07', monthLabel: '2026년 7월', startValue: 47800, endValue: 49500, netProfit: 1700, returnRate: 3.56, marketIndex: 6750 },
  { id: 'm12', month: '2026-08', monthLabel: '2026년 8월', startValue: 49500, endValue: 51240, netProfit: 1740, returnRate: 3.52, marketIndex: 6890 },
];
