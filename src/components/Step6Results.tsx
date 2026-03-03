import React from 'react';
import { Prize } from '../types';
import { Trophy, Download, RotateCcw } from 'lucide-react';

interface Props {
  prizes: Prize[];
  onReset: () => void;
}

export default function Step6Results({ prizes, onReset }: Props) {
  const handleExport = () => {
    // Simple CSV export
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Giải thưởng,Tên người trúng\n";
    
    prizes.forEach(prize => {
      prize.winners.forEach(winner => {
        csvContent += `"${prize.name}","${winner.name}"\n`;
      });
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "danh_sach_trung_thuong.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Trophy className="text-amber-500 w-8 h-8" />
            Danh sách trúng thưởng
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" /> Xuất CSV
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
            >
              <RotateCcw className="w-5 h-5" /> Làm lại
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {prizes.map((prize) => (
            <div key={prize.id} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex justify-between items-center">
                  {prize.name}
                  <span className="text-indigo-200 text-sm font-normal">
                    Số lượng: {prize.quantity}
                  </span>
                </h3>
              </div>
              <div className="p-6">
                {prize.winners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {prize.winners.map((winner, idx) => (
                      <div key={winner.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img src={winner.avatar} alt={winner.name} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                          <p className="font-medium text-gray-800 truncate">{winner.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có người trúng thưởng</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
