import React from 'react';
import { StockHolding } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Award, 
  BarChart2, 
  ShieldAlert 
} from 'lucide-react';

interface ProfitLossViewProps {
  holdings: StockHolding[];
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({ holdings }) => {
  const totalCost = holdings.reduce((acc, h) => acc + (h.shares * h.purchasePrice), 0);
  const totalValue = holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
  const totalProfit = totalValue - totalCost;
  const totalReturnRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  // Enriched stock profit calculations
  const enrichedHoldings = holdings.map(h => {
    const cost = h.shares * h.purchasePrice;
    const valuation = h.shares * h.currentPrice;
    const profit = valuation - cost;
    const returnRate = cost > 0 ? (profit / cost) * 100 : 0;
    return { ...h, cost, valuation, profit, returnRate };
  }).sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            포트폴리오 수익 및 손익 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            종목별 투자 원금 대비 평가 손익, 수익률 및 월스트리트 표준 성과 지표
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border font-mono text-sm font-bold flex items-center space-x-2 ${
          totalProfit >= 0 ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'
        }`}>
          {totalProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>총 손익: {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({totalReturnRate >= 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%)</span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">총 투자 원금</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">매입단가 기준 총 투입 금액</p>
        </div>

        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">총 평가 금액</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">현재 시세 기준 총 자산 가치</p>
        </div>

        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">총 평가 손익 금액</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">누적 순이익 ({totalReturnRate.toFixed(2)}%)</p>
        </div>
      </div>

      {/* Profit/Loss Table */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            종목별 상세 수익 및 손익 랭킹
          </h3>
          <span className="text-xs font-mono text-slate-400">수익금 순 정렬</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B132B] text-xs uppercase font-mono text-slate-400 border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3.5">티커 / 종목명</th>
                <th className="px-6 py-3.5">섹터</th>
                <th className="px-6 py-3.5 text-right">투자 원금</th>
                <th className="px-6 py-3.5 text-right">평가 금액</th>
                <th className="px-6 py-3.5 text-right">평가 손익 ($)</th>
                <th className="px-6 py-3.5 text-right">수익률 (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {enrichedHoldings.map(stock => {
                const isProfit = stock.profit >= 0;
                return (
                  <tr key={stock.id} className="hover:bg-[#162244] transition">
                    <td className="px-6 py-4 font-mono">
                      <div className="font-bold text-white text-base">{stock.ticker}</div>
                      <div className="text-xs text-slate-400">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                        stock.sector === 'IT' ? 'bg-blue-950 text-blue-400' :
                        stock.sector === '바이오' ? 'bg-emerald-950 text-emerald-400' :
                        stock.sector === '에너지' ? 'bg-amber-950 text-amber-400' : 'bg-pink-950 text-pink-400'
                      }`}>
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      ${stock.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                      ${stock.valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${stock.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold text-base ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end space-x-1">
                        {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{isProfit ? '+' : ''}{stock.returnRate.toFixed(2)}%</span>
                      </div>
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
