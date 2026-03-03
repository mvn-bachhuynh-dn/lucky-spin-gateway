import React, { useState } from 'react';
import { Prize } from '../types';
import { Plus, Trash2, ArrowRight, Gift } from 'lucide-react';

interface Props {
  onNext: (prizes: Prize[]) => void;
}

export default function Step4ConfigurePrizes({ onNext }: Props) {
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: '1', name: 'Quần chạy bộ', quantity: 10, winners: [] },
    { id: '2', name: 'Áo Ba lỗ chạy bộ', quantity: 5, winners: [] },
    { id: '3', name: 'Đèn pin chạy buổi tối', quantity: 5, winners: [] },
    { id: '4', name: 'Đôi tất chạy bộ', quantity: 60, winners: [] },
  ]);

  const addPrize = () => {
    setPrizes([...prizes, { id: Date.now().toString(), name: '', quantity: 1, winners: [] }]);
  };

  const updatePrize = (id: string, field: keyof Prize, value: any) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const isValid = prizes.length > 0 && prizes.every(p => p.name.trim() !== '' && p.quantity > 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Bước 4: Cấu hình giải thưởng</h2>
        <p className="text-gray-500 mb-6">Nhập danh sách các phần quà và số lượng tương ứng.</p>

        <div className="space-y-4 mb-6">
          {prizes.map((prize, index) => (
            <div key={prize.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Tên phần quà"
                  value={prize.name}
                  onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="w-full sm:w-32">
                <input
                  type="number"
                  min="1"
                  placeholder="Số lượng"
                  value={prize.quantity}
                  onChange={(e) => updatePrize(prize.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => removePrize(prize.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={addPrize}
            className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" /> Thêm phần quà
          </button>

          <button
            onClick={() => onNext(prizes)}
            disabled={!isValid}
            className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
          >
            Tiếp tục <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
