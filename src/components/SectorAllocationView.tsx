import React, { useState } from 'react';
import { StockHolding, Sector } from '../types';
import { 
  PieChart as PieIcon, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface SectorAllocationViewProps {
  holdings: StockHolding[];
}

const SECTOR_COLORS: Record<Sector, string> = {
  'IT': '#3B82F6',       // Blue
  '바이오': '#10B981',   // Emerald
  '에너지': '#F59E0B',   // Amber
  '소비재': '#EC4899'    // Pink
};

export const SectorAllocationView: React.FC<SectorAllocationViewProps> = ({ holdings }) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<Sector | 'ALL'>('ALL');

  // Calculate totals
  const totalPortfolioValue = holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
  const totalPortfolioCost = holdings.reduce((acc, h) => acc + (h.shares * h.purchasePrice), 0);

  const sectorDataMap: Record<Sector, { value: number, cost: number, count: number }> = {
    'IT': { value: 0, cost: 0, count: 0 },
    '바이오': { value: 0, cost: 0, count: 0 },
    '에너지': { value: 0, cost: 0, count: 0 },
    '소비재': { value: 0, cost: 0, count: 0 }
  };

  holdings.forEach(h => {
    const val = h.shares * h.currentPrice;
    const cost = h.shares * h.purchasePrice;
    if (sectorDataMap[h.sector]) {
      sectorDataMap[h.sector].value += val;
      sectorDataMap[h.sector].cost += cost;
      sectorDataMap[h.sector].count += 1;
    }
  });

  const chartData = (['IT', '바이오', '에너지', '소비재'] as Sector[]).map(sector => ({
    name: sector,
    value: sectorDataMap[sector].value,
    cost: sectorDataMap[sector].cost,
    count: sectorDataMap[sector].count,
    percentage: totalPortfolioValue > 0 ? (sectorDataMap[sector].value / totalPortfolioValue) * 100 : 0,
    color: SECTOR_COLORS[sector]
  }));

  const filteredHoldings = selectedSectorFilter === 'ALL' 
    ? holdings 
    : holdings.filter(h => h.sector === selectedSectorFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-blue-400" />
            섹터별 포트폴리오 비중 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            IT, 바이오, 에너지, 소비재 4대 핵심 섹터별 자산 분산 및 리스크 관리 현황
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-slate-300 bg-[#0B132B] px-3 py-1.5 rounded-lg border border-[#1C2541]">
          <span>총 자산:</span>
          <span className="text-amber-400 font-bold">${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Main Grid: Chart + Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart Card */}
        <div className="lg:col-span-5 bg-[#111C38] border border-[#1C2541] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 self-start flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            섹터별 자산 배분 비중
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111C38" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '평가금액']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            {chartData.map(sec => (
              <div key={sec.name} className="flex items-center justify-between bg-[#0B132B] px-3 py-2 rounded-lg border border-[#1C2541]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }}></span>
                  <span className="text-xs font-semibold text-slate-300">{sec.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">{sec.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['IT', '바이오', '에너지', '소비재'] as Sector[]).map(sector => {
            const data = sectorDataMap[sector];
            const pct = totalPortfolioValue > 0 ? (data.value / totalPortfolioValue) * 100 : 0;
            const profit = data.value - data.cost;
            const returnRate = data.cost > 0 ? (profit / data.cost) * 100 : 0;
            const isSelected = selectedSectorFilter === sector;

            const c = SECTOR_COLORS[sector];

            return (
              <div 
                key={sector}
                onClick={() => setSelectedSectorFilter(isSelected ? 'ALL' : sector)}
                className={`bg-[#111C38] border rounded-xl p-5 shadow-lg cursor-pointer transition relative overflow-hidden ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-[#1C2541] hover:border-slate-600'
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-bl-full"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c }}></span>
                    <h4 className="text-base font-bold text-white">{sector} 섹터</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0B132B] text-amber-400 border border-[#1C2541]">
                    {pct.toFixed(1)}% 비중
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">평가 금액:</span>
                    <span className="font-mono font-bold text-white">${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">보유 종목수:</span>
                    <span className="font-mono text-slate-200">{data.count}개 종목</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">섹터 수익률:</span>
                    <span className={`font-mono font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profit >= 0 ? '+' : ''}{returnRate.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#0B132B] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: c }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Holdings Breakdown Table */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {selectedSectorFilter === 'ALL' ? '전체 섹터 종목 상세 리스트' : `[${selectedSectorFilter} 섹터] 보유 종목 상세`}
            </h3>
          </div>
          {selectedSectorFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedSectorFilter('ALL')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
            >
              전체 보기로 돌아가기
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B132B] text-xs uppercase font-mono text-slate-400 border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">티커 / 종목명</th>
                <th className="px-6 py-3">섹터</th>
                <th className="px-6 py-3 text-right">보유 주식수</th>
                <th className="px-6 py-3 text-right">평균 단가</th>
                <th className="px-6 py-3 text-right">현재가</th>
                <th className="px-6 py-3 text-right">평가 금액</th>
                <th className="px-6 py-3 text-right">비중 (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {filteredHoldings.map(stock => {
                const val = stock.shares * stock.currentPrice;
                const shareOfTotal = totalPortfolioValue > 0 ? (val / totalPortfolioValue) * 100 : 0;

                return (
                  <tr key={stock.id} className="hover:bg-[#162244] transition">
                    <td className="px-6 py-4 font-mono">
                      <div className="font-bold text-white">{stock.ticker}</div>
                      <div className="text-xs text-slate-400">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[#0B132B] text-white border border-[#1C2541]">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-200">
                      {stock.shares}주
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-400">
                      ${stock.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                      ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-amber-400">
                      {shareOfTotal.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
