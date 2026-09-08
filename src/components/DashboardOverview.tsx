import React from 'react';
import { StockHolding, Sector } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  Briefcase, 
  Award,
  Layers
} from 'lucide-react';

interface DashboardOverviewProps {
  holdings: StockHolding[];
  onNavigate: (tab: any) => void;
  onSelectStock: (stock: StockHolding) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  holdings,
  onNavigate,
  onSelectStock
}) => {
  // Calculations
  const totalCost = holdings.reduce((acc, h) => acc + (h.shares * h.purchasePrice), 0);
  const totalValue = holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
  const totalProfit = totalValue - totalCost;
  const totalReturnRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  // Sector totals
  const sectorTotals: Record<Sector, number> = {
    'IT': 0,
    '바이오': 0,
    '에너지': 0,
    '소비재': 0
  };

  holdings.forEach(h => {
    const val = h.shares * h.currentPrice;
    if (sectorTotals[h.sector] !== undefined) {
      sectorTotals[h.sector] += val;
    }
  });

  // Top gainer and loser
  const sortedByReturn = [...holdings].sort((a, b) => {
    const retA = ((a.currentPrice - a.purchasePrice) / a.purchasePrice);
    const retB = ((b.currentPrice - b.purchasePrice) / b.purchasePrice);
    return retB - retA;
  });

  const topGainer = sortedByReturn[0];
  const topLoser = sortedByReturn[sortedByReturn.length - 1];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111C38] via-[#1C2541] to-[#0B132B] border border-blue-900/40 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              WALL STREET WEALTH DESK
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              실시간 포트폴리오 자산 요약
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              미국 주식 시장 자산 분산 및 섹터별(IT, 바이오, 에너지, 소비재) 수익률 통합 관제
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('sectors')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition flex items-center space-x-2"
            >
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span>섹터 비중 분석</span>
            </button>
            <button
              onClick={() => onNavigate('monthly')}
              className="px-4 py-2 bg-[#1C2541] hover:bg-[#2A3B63] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow transition flex items-center space-x-2"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>월별 수익 추이</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Asset Value */}
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">총 평가 자산</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            <span>총 투자원금:</span>
            <span className="ml-1 font-mono text-slate-300">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Total Profit / Loss */}
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">총 평가 손익</span>
            <div className={`p-2 rounded-lg ${totalProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {totalProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold font-mono ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            <span>수익률:</span>
            <span className={`ml-1 font-mono font-bold ${totalReturnRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalReturnRate >= 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">최고 수익 종목</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          {topGainer ? (
            <div>
              <div className="text-lg font-bold font-mono text-white flex items-center justify-between">
                <span>{topGainer.ticker}</span>
                <span className="text-emerald-400 text-sm font-semibold">
                  +{(((topGainer.currentPrice - topGainer.purchasePrice) / topGainer.purchasePrice) * 100).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-1">{topGainer.name}</p>
            </div>
          ) : (
            <div className="text-sm text-slate-500">종목 없음</div>
          )}
        </div>

        {/* Holdings Count & Sectors */}
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">포트폴리오 현황</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {holdings.length} <span className="text-sm text-slate-400 font-normal">종목 보유</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>활성 섹터:</span>
            <span className="font-mono text-amber-400">4개 섹터 (IT/바이오/에너지/소비재)</span>
          </div>
        </div>
      </div>

      {/* Sector Quick Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {(['IT', '바이오', '에너지', '소비재'] as Sector[]).map(sector => {
          const val = sectorTotals[sector];
          const ratio = totalValue > 0 ? (val / totalValue) * 100 : 0;
          const sectorHoldings = holdings.filter(h => h.sector === sector);

          const sectorColors: Record<Sector, { border: string, bg: string, text: string }> = {
            'IT': { border: 'border-blue-500/30', bg: 'bg-blue-950/20', text: 'text-blue-400' },
            '바이오': { border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', text: 'text-emerald-400' },
            '에너지': { border: 'border-amber-500/30', bg: 'bg-amber-950/20', text: 'text-amber-400' },
            '소비재': { border: 'border-pink-500/30', bg: 'bg-pink-950/20', text: 'text-pink-400' }
          };

          const c = sectorColors[sector];

          return (
            <div 
              key={sector} 
              onClick={() => onNavigate('sectors')}
              className={`bg-[#111C38] border ${c.border} rounded-xl p-5 shadow-lg cursor-pointer hover:bg-[#162244] transition group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${c.bg} ${c.text}`}>
                  {sector} 섹터
                </span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-amber-400 transition">
                  {sectorHoldings.length}개 종목 →
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white mb-1">
                ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>비중:</span>
                <span className="font-mono font-semibold text-slate-200">{ratio.toFixed(1)}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full ${sector === 'IT' ? 'bg-blue-500' : sector === '바이오' ? 'bg-emerald-500' : sector === '에너지' ? 'bg-amber-500' : 'bg-pink-500'}`}
                  style={{ width: `${Math.min(ratio, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Holdings Quick Table */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">주요 보유 종목 실시간 현황</h3>
          </div>
          <button 
            onClick={() => onNavigate('prices')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            전체 보기 →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B132B] text-xs uppercase font-mono text-slate-400 border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">티커 / 종목명</th>
                <th className="px-6 py-3">섹터</th>
                <th className="px-6 py-3 text-right">보유 수량</th>
                <th className="px-6 py-3 text-right">현재가</th>
                <th className="px-6 py-3 text-right">평가 금액</th>
                <th className="px-6 py-3 text-right">수익률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {holdings.slice(0, 5).map(stock => {
                const valuation = stock.shares * stock.currentPrice;
                const cost = stock.shares * stock.purchasePrice;
                const profit = valuation - cost;
                const returnRate = cost > 0 ? (profit / cost) * 100 : 0;
                const isProfit = profit >= 0;

                return (
                  <tr 
                    key={stock.id} 
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-[#162244] cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-mono">
                      <div className="font-bold text-white">{stock.ticker}</div>
                      <div className="text-xs text-slate-400">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        stock.sector === 'IT' ? 'bg-blue-950 text-blue-400' :
                        stock.sector === '바이오' ? 'bg-emerald-950 text-emerald-400' :
                        stock.sector === '에너지' ? 'bg-amber-950 text-amber-400' : 'bg-pink-950 text-pink-400'
                      }`}>
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-200">
                      {stock.shares}주
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white">
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                      ${valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}{returnRate.toFixed(2)}%
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
