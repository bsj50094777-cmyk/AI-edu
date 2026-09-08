import React from 'react';
import { TabType } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  Plus, 
  RefreshCw,
  Activity,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onRefreshPrices: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onRefreshPrices,
  isRefreshing
}) => {
  return (
    <header className="bg-[#0B132B] border-b border-[#1C2541] sticky top-0 z-50 shadow-xl">
      {/* Ticker banner */}
      <div className="bg-[#060A17] text-xs py-1.5 px-4 text-slate-400 border-b border-[#1C2541]/60 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center space-x-6 animate-pulse">
          <span className="flex items-center text-emerald-400 font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5"></span>
            NYSE: OPEN
          </span>
          <span className="text-slate-300">S&P 500 <strong className="text-emerald-400">+0.84%</strong></span>
          <span className="text-slate-300">NASDAQ <strong className="text-emerald-400">+1.12%</strong></span>
          <span className="text-slate-300">DJIA <strong className="text-red-400">-0.15%</strong></span>
          <span className="text-slate-300">US10Y <strong className="text-amber-400">4.21%</strong></span>
        </div>
        <div className="hidden md:flex items-center space-x-4 font-mono text-[11px] text-slate-400">
          <span>WALL STREET TERMINAL v4.2</span>
          <span>SEC REGULATED DATA</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center border border-blue-400/30 shadow-lg">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white uppercase font-mono flex items-center gap-1.5">
                WALL STREET <span className="text-amber-400 font-extrabold">PORTFOLIO</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Professional Asset Management</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefreshPrices}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#1C2541] hover:bg-[#2A3B63] text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="실시간 시세 갱신"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">시세 동기화</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>종목 추가</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-[#1C2541] pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>종합 대시보드</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'prices'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>현재 가격 조회</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'sectors'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <PieIcon className="w-4 h-4 text-blue-400" />
            <span>섹터별 비중</span>
          </button>

          <button
            onClick={() => setActiveTab('profit')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'profit'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>수익 분석</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'monthly'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>월별 수익 변화</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-analysis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'ai-analysis'
                ? 'bg-blue-600 text-white shadow-md border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI 분석 및 추천</span>
          </button>
        </div>
      </div>
    </header>
  );
};
