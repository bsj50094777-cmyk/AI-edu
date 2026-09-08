import React, { useState, useEffect } from 'react';
import { StockHolding, Sector } from '../types';
import { X, DollarSign, Briefcase } from 'lucide-react';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stock: Omit<StockHolding, 'id'> & { id?: string }) => void;
  stockToEdit?: StockHolding | null;
}

export const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  stockToEdit
}) => {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState<Sector>('IT');
  const [shares, setShares] = useState('10');
  const [purchasePrice, setPurchasePrice] = useState('100');
  const [currentPrice, setCurrentPrice] = useState('100');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (stockToEdit) {
      setTicker(stockToEdit.ticker);
      setName(stockToEdit.name);
      setSector(stockToEdit.sector);
      setShares(stockToEdit.shares.toString());
      setPurchasePrice(stockToEdit.purchasePrice.toString());
      setCurrentPrice(stockToEdit.currentPrice.toString());
      setNotes(stockToEdit.notes || '');
    } else {
      setTicker('');
      setName('');
      setSector('IT');
      setShares('10');
      setPurchasePrice('100');
      setCurrentPrice('100');
      setNotes('');
    }
  }, [stockToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedShares = parseFloat(shares) || 0;
    const parsedPurchase = parseFloat(purchasePrice) || 0;
    const parsedCurrent = parseFloat(currentPrice) || parsedPurchase;

    onSave({
      id: stockToEdit ? stockToEdit.id : undefined,
      ticker: ticker.toUpperCase(),
      name: name || ticker,
      sector,
      shares: parsedShares,
      purchasePrice: parsedPurchase,
      currentPrice: parsedCurrent,
      previousClose: parsedCurrent * 0.99,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111C38] border border-[#1C2541] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Briefcase className="w-5 h-5 text-amber-400" />
          {stockToEdit ? '보유 종목 정보 수정' : '신규 주식 종목 추가'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">티커 심볼 (예: AAPL)</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
                placeholder="AAPL"
                className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">종목명</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Apple Inc."
                className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">섹터 선택 (필수)</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="IT">IT (정보기술 / 소프트웨어 / 반도체)</option>
              <option value="바이오">바이오 (헬스케어 / 제약 / 바이오)</option>
              <option value="에너지">에너지 (석유 / 가스 / 신재생에너지)</option>
              <option value="소비재">소비재 (경기소비재 / 필수소비재)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">보유 주식수</label>
              <input
                type="number"
                step="any"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                required
                className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">매입 평단가 ($)</label>
              <input
                type="number"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                required
                className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">현재가 ($)</label>
              <input
                type="number"
                step="any"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                required
                className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">메모 / 특이사항</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 장기 배당 성장주"
              className="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#1C2541]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1C2541] hover:bg-[#2A3B63] text-slate-300 rounded-lg text-xs font-semibold transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition"
            >
              {stockToEdit ? '수정 완료' : '종목 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
