import React, { useState, useEffect } from 'react';
import { TabType, StockHolding, MonthlyRecord } from './types';
import { INITIAL_HOLDINGS, INITIAL_MONTHLY_RECORDS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CurrentPricesView } from './components/CurrentPricesView';
import { SectorAllocationView } from './components/SectorAllocationView';
import { ProfitLossView } from './components/ProfitLossView';
import { MonthlyTrendsView } from './components/MonthlyTrendsView';
import { AiAnalysisView } from './components/AiAnalysisView';
import { StockModal } from './components/StockModal';
import { ShieldCheck, TrendingUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Load from localStorage or initial
  const [holdings, setHoldings] = useState<StockHolding[]>(() => {
    const saved = localStorage.getItem('wallstreet_portfolio_holdings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HOLDINGS;
  });

  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>(() => {
    const saved = localStorage.getItem('wallstreet_portfolio_monthly');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MONTHLY_RECORDS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockToEdit, setStockToEdit] = useState<StockHolding | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('wallstreet_portfolio_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('wallstreet_portfolio_monthly', JSON.stringify(monthlyRecords));
  }, [monthlyRecords]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setHoldings(prev => prev.map(stock => {
        // Random price fluctuation between -1.5% and +1.8%
        const pct = (Math.random() * 3.3 - 1.4) / 100;
        const newPrice = Number((stock.currentPrice * (1 + pct)).toFixed(2));
        return {
          ...stock,
          previousClose: stock.currentPrice,
          currentPrice: newPrice
        };
      }));
      setIsRefreshing(false);
      showToast('실시간 뉴욕증권거래소(NYSE) 시세가 동기화되었습니다.');
    }, 800);
  };

  const handleSaveStock = (stockData: Omit<StockHolding, 'id'> & { id?: string }) => {
    if (stockData.id) {
      // Edit
      setHoldings(prev => prev.map(s => s.id === stockData.id ? { ...s, ...stockData } as StockHolding : s));
      showToast(`종목 [${stockData.ticker}] 정보가 수정되었습니다.`);
    } else {
      // Add
      const newStock: StockHolding = {
        ...stockData,
        id: 'stock-' + Date.now()
      };
      setHoldings(prev => [newStock, ...prev]);
      showToast(`신규 종목 [${newStock.ticker}]이(가) 포트폴리오에 추가되었습니다.`);
    }
    setStockToEdit(null);
  };

  const handleDeleteStock = (id: string) => {
    if (window.confirm('정말 이 종목을 포트폴리오에서 삭제하시겠습니까?')) {
      setHoldings(prev => prev.filter(s => s.id !== id));
      showToast('종목이 삭제되었습니다.');
    }
  };

  const handleEditStock = (stock: StockHolding) => {
    setStockToEdit(stock);
    setIsModalOpen(true);
  };

  const handleAddMonthlyRecord = (record: MonthlyRecord) => {
    setMonthlyRecords(prev => [...prev, record]);
    showToast('새로운 월별 실적 기록이 추가되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C2541] border border-amber-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => { setStockToEdit(null); setIsModalOpen(true); }}
        onRefreshPrices={handleRefreshPrices}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            holdings={holdings}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectStock={(stock) => {
              setStockToEdit(stock);
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'prices' && (
          <CurrentPricesView
            holdings={holdings}
            onRefreshPrices={handleRefreshPrices}
            isRefreshing={isRefreshing}
            onEditStock={handleEditStock}
            onDeleteStock={handleDeleteStock}
          />
        )}

        {activeTab === 'sectors' && (
          <SectorAllocationView holdings={holdings} />
        )}

        {activeTab === 'profit' && (
          <ProfitLossView holdings={holdings} />
        )}

        {activeTab === 'monthly' && (
          <MonthlyTrendsView
            monthlyRecords={monthlyRecords}
            onAddMonthlyRecord={handleAddMonthlyRecord}
          />
        )}

        {activeTab === 'ai-analysis' && (
          <AiAnalysisView holdings={holdings} />
        )}
      </main>

      {/* Stock Modal for Add / Edit */}
      <StockModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setStockToEdit(null); }}
        onSave={handleSaveStock}
        stockToEdit={stockToEdit}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-[#1C2541] text-center text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WALL STREET PORTFOLIO MANAGEMENT SYSTEM © 2026</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            SEC & NYSE COMPLIANT TERMINAL SIMULATION
          </span>
        </div>
      </footer>
    </div>
  );
}
