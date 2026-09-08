import React, { useState } from 'react';
import { MonthlyRecord } from '../types';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  ArrowUpRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';

interface MonthlyTrendsViewProps {
  monthlyRecords: MonthlyRecord[];
  onAddMonthlyRecord: (record: MonthlyRecord) => void;
}

export const MonthlyTrendsView: React.FC<MonthlyTrendsViewProps> = ({
  monthlyRecords,
  onAddMonthlyRecord
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMonth, setNewMonth] = useState('2026-09');
  const [newMonthLabel, setNewMonthLabel] = useState('2026년 9월');
  const [newStartVal, setNewStartVal] = useState('51240');
  const [newEndVal, setNewEndVal] = useState('53500');

  // Calculations
  const totalNetProfit = monthlyRecords.reduce((acc, r) => acc + r.netProfit, 0);
  const bestMonth = [...monthlyRecords].sort((a, b) => b.returnRate - a.returnRate)[0];
  const worstMonth = [...monthlyRecords].sort((a, b) => a.returnRate - b.returnRate)[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseFloat(newStartVal) || 0;
    const end = parseFloat(newEndVal) || 0;
    const profit = end - start;
    const rate = start > 0 ? (profit / start) * 100 : 0;

    const newRec: MonthlyRecord = {
      id: 'm-' + Date.now(),
      month: newMonth,
      monthLabel: newMonthLabel,
      startValue: start,
      endValue: end,
      netProfit: profit,
      returnRate: rate,
      marketIndex: 6950
    };

    onAddMonthlyRecord(newRec);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            월별 수익 변화 및 실적 추이 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            월별 순이익 변동 내역, 월간 수익률(%) 및 S&P 500 시장 지수 비교 관제
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>월별 실적 추가</span>
        </button>
      </div>

      {/* Summary KPI Cards for Monthly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">누적 월간 순이익</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${totalNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalNetProfit >= 0 ? '+' : ''}${totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">기록된 전체 월별 수익 합계</p>
        </div>

        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">최고 성과 월</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {bestMonth ? `${bestMonth.monthLabel} (+${bestMonth.returnRate.toFixed(2)}%)` : '-'}
          </div>
          <p className="text-xs text-slate-500 mt-1">최고 월간 수익률 기록</p>
        </div>

        <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">최저 성과 월</span>
          <div className={`text-xl font-bold font-mono mt-1 ${worstMonth && worstMonth.returnRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {worstMonth ? `${worstMonth.monthLabel} (${worstMonth.returnRate >= 0 ? '+' : ''}${worstMonth.returnRate.toFixed(2)}%)` : '-'}
          </div>
          <p className="text-xs text-slate-500 mt-1">조정 또는 하락 기록 월</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          월별 순이익 변화 그래프 ($)
        </h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRecords}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
              <XAxis dataKey="monthLabel" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '순이익']}
              />
              <Bar dataKey="netProfit" radius={[4, 4, 0, 0]}>
                {monthlyRecords.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.netProfit >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Records Table */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            월별 수익 변동 상세 내역
          </h3>
          <span className="text-xs font-mono text-slate-400">총 {monthlyRecords.length}개월 기록</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B132B] text-xs uppercase font-mono text-slate-400 border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3.5">조회 기간</th>
                <th className="px-6 py-3.5 text-right">월초 자산</th>
                <th className="px-6 py-3.5 text-right">월말 자산</th>
                <th className="px-6 py-3.5 text-right">월간 순이익</th>
                <th className="px-6 py-3.5 text-right">월간 수익률</th>
                <th className="px-6 py-3.5 text-right">S&P 지수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {monthlyRecords.map(record => {
                const isProfit = record.netProfit >= 0;
                return (
                  <tr key={record.id} className="hover:bg-[#162244] transition">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {record.monthLabel}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                      ${record.startValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                      ${record.endValue.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${record.netProfit.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}{record.returnRate.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-400">
                      {record.marketIndex} pt
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Monthly Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111C38] border border-[#1C2541] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              새로운 월별 실적 기록 추가
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">월 코드 (YYYY-MM)</label>
                <input
                  type="text"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  required
                  className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">표시 라벨</label>
                <input
                  type="text"
                  value={newMonthLabel}
                  onChange={(e) => setNewMonthLabel(e.target.value)}
                  required
                  className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">월초 자산 ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={newStartVal}
                    onChange={(e) => setNewStartVal(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">월말 자산 ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={newEndVal}
                    onChange={(e) => setNewEndVal(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#1C2541]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#1C2541] hover:bg-[#2A3B63] text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  기록 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
