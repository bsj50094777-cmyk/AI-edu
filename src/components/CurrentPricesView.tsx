import React, { useState } from 'react';
import { StockHolding, Sector } from '../types';
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Edit3, 
  Trash2, 
  DollarSign,
  ArrowUpDown
} from 'lucide-react';

interface CurrentPricesViewProps {
  holdings: StockHolding[];
  onRefreshPrices: () => void;
  isRefreshing: boolean;
  onEditStock: (stock: StockHolding) => void;
  onDeleteStock: (id: string) => void;
}

export const CurrentPricesView: React.FC<CurrentPricesViewProps> = ({
  holdings,
  onRefreshPrices,
  isRefreshing,
  onEditStock,
  onDeleteStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<Sector | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'ticker' | 'price' | 'change' | 'value'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort
  const filtered = holdings.filter(h => {
    const matchesSearch = h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || h.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'ticker') {
      return sortOrder === 'asc' ? a.ticker.localeCompare(b.ticker) : b.ticker.localeCompare(a.ticker);
    } else if (sortBy === 'price') {
      valA = a.currentPrice;
      valB = b.currentPrice;
    } else if (sortBy === 'change') {
      valA = ((a.currentPrice - a.previousClose) / a.previousClose);
      valB = ((b.currentPrice - b.previousClose) / b.previousClose);
    } else if (sortBy === 'value') {
      valA = a.shares * a.currentPrice;
      valB = b.shares * b.currentPrice;
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const toggleSort = (criterion: typeof sortBy) => {
    if (sortBy === criterion) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criterion);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            실시간 주식 현재 가격 관제
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            미국 월스트리트 실시간 시세 연동 및 보유 종목별 등락 현황 모니터링
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshPrices}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>실시간 시세 갱신</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="티커 또는 종목명 검색 (예: AAPL, NVDA)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'IT', '바이오', '에너지', '소비재'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedSector === sec
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white border border-[#1C2541]'
              }`}
            >
              {sec === 'ALL' ? '전체 섹터' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-[#111C38] border border-[#1C2541] rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B132B] text-xs uppercase font-mono text-slate-400 border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3.5 cursor-pointer hover:text-white" onClick={() => toggleSort('ticker')}>
                  <div className="flex items-center space-x-1">
                    <span>티커 / 종목명</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">섹터</th>
                <th className="px-6 py-3.5 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('price')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>현재가</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('change')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>전일 대비 등락</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">보유 수량 / 평단가</th>
                <th className="px-6 py-3.5 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('value')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>평가 금액</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-mono">
                    검색 결과에 해당하는 종목이 없습니다.
                  </td>
                </tr>
              ) : (
                sorted.map(stock => {
                  const changeAmt = stock.currentPrice - stock.previousClose;
                  const changePct = stock.previousClose > 0 ? (changeAmt / stock.previousClose) * 100 : 0;
                  const isUp = changeAmt >= 0;
                  const valuation = stock.shares * stock.currentPrice;

                  return (
                    <tr key={stock.id} className="hover:bg-[#162244] transition">
                      <td className="px-6 py-4 font-mono">
                        <div className="font-bold text-white text-base">{stock.ticker}</div>
                        <div className="text-xs text-slate-400">{stock.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                          stock.sector === 'IT' ? 'bg-blue-950 text-blue-400 border border-blue-800/50' :
                          stock.sector === '바이오' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                          stock.sector === '에너지' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' : 'bg-pink-950 text-pink-400 border border-pink-800/50'
                        }`}>
                          {stock.sector}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-white text-base">
                        ${stock.currentPrice.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{isUp ? '+' : ''}${changeAmt.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-300">
                        <div>{stock.shares}주</div>
                        <div className="text-xs text-slate-500">평단 ${stock.purchasePrice.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-white">
                        ${valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEditStock(stock)}
                            className="p-1.5 bg-[#1C2541] hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition"
                            title="수정"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStock(stock.id)}
                            className="p-1.5 bg-[#1C2541] hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
