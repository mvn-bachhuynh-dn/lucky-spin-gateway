import React, { useState, useEffect, useRef } from 'react';
import { Prize, User } from '../types';
import { playWinSound } from '../utils/audio';
import { Trophy, Dices, Settings, CheckCircle2, Edit3, Plus, Trash2, Save, Users as UsersIcon, X } from 'lucide-react';
import RouletteWheel from './RouletteWheel';

interface Props {
  prizes: Prize[];
  users: User[];
  onComplete: (finalPrizes: Prize[]) => void;
}

export default function Step5SpinWinners({ prizes: initialPrizes, users: initialUsers, onComplete }: Props) {
  const [prizes, setPrizes] = useState<Prize[]>(initialPrizes);
  const [availableUsers, setAvailableUsers] = useState<User[]>(initialUsers);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [winner, setWinner] = useState<User | null>(null);
  const [spinDuration, setSpinDuration] = useState(3); // seconds
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingPrizes, setIsEditingPrizes] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);

  const currentPrize = prizes[currentPrizeIndex];
  const isPrizeComplete = currentPrize?.winners?.length >= currentPrize?.quantity;
  const isAllComplete = prizes.length > 0 && prizes.every(p => p.winners.length >= p.quantity);

  const updatePrize = (id: string, field: keyof Prize, value: any) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPrize = () => {
    setPrizes([...prizes, { id: Date.now().toString(), name: '', quantity: 1, winners: [] }]);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleSavePrizes = () => {
    const firstIncompleteIndex = prizes.findIndex(p => p.winners.length < p.quantity);
    if (firstIncompleteIndex !== -1) {
      setCurrentPrizeIndex(firstIncompleteIndex);
    } else {
      setCurrentPrizeIndex(Math.max(0, prizes.length - 1));
    }
    setIsEditingPrizes(false);
  };

  const startSpin = () => {
    if (availableUsers.length === 0 || isAllComplete || isSpinning || isWaiting || !currentPrize) return;
    
    const finalIndex = Math.floor(Math.random() * availableUsers.length);
    setTargetIndex(finalIndex);
    setIsSpinning(true);
    setIsWaiting(true);
    setWinner(null);
  };

  const handleStop = () => {
    setIsSpinning(false);
    const finalWinner = availableUsers[targetIndex];
    setWinner(finalWinner);
    playWinSound();
    
    setTimeout(() => {
      const updatedPrizes = [...prizes];
      if (updatedPrizes[currentPrizeIndex]) {
        updatedPrizes[currentPrizeIndex].winners.push(finalWinner);
        setPrizes(updatedPrizes);
        
        setAvailableUsers(prev => prev.filter(u => u.id !== finalWinner.id));
        
        // Check if current prize is full, move to next incomplete
        if (updatedPrizes[currentPrizeIndex].winners.length >= updatedPrizes[currentPrizeIndex].quantity) {
          const nextIncomplete = updatedPrizes.findIndex(p => p.winners.length < p.quantity);
          if (nextIncomplete !== -1) {
            setCurrentPrizeIndex(nextIncomplete);
          }
        }
      }
      setIsWaiting(false);
    }, 2000); // Wait 2s before updating lists so they can see the winner
  };

  if (isAllComplete && !isEditingPrizes) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đã quay xong tất cả giải thưởng!</h2>
        <p className="text-gray-500 mb-8 text-lg">Chúc mừng các thành viên may mắn đã nhận được quà.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsEditingPrizes(true)}
            className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all font-bold text-lg"
          >
            Thêm giải thưởng
          </button>
          <button
            onClick={() => onComplete(prizes)}
            className="px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Xem danh sách tổng kết
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Trophy className="text-amber-500" />
            Quay số trúng thưởng
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUsersModal(true)}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 font-medium text-sm hidden sm:flex"
            >
              <UsersIcon className="w-4 h-4" /> Danh sách tham gia
            </button>
            <button
              onClick={() => setShowUsersModal(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors sm:hidden"
              title="Danh sách tham gia"
            >
              <UsersIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsEditingPrizes(!isEditingPrizes);
                setShowSettings(false);
              }}
              className={`p-2 rounded-full transition-colors ${isEditingPrizes ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              title="Chỉnh sửa giải thưởng"
            >
              <Edit3 className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setIsEditingPrizes(false);
              }}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              title="Cài đặt vòng quay"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-in slide-in-from-top-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian quay mỗi lượt (giây)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={spinDuration}
              onChange={(e) => setSpinDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="text-right text-sm text-gray-500 mt-1">{spinDuration} giây</div>
          </div>
        )}

        {isEditingPrizes && (
          <div className="mb-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-indigo-900">Cấu hình giải thưởng</h3>
              <button
                onClick={handleSavePrizes}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Save className="w-4 h-4" /> Lưu thay đổi
              </button>
            </div>
            <div className="space-y-3">
              {prizes.map((prize, index) => (
                <div key={prize.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Tên phần quà"
                      value={prize.name}
                      onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="w-full sm:w-32 flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">SL:</span>
                    <input
                      type="number"
                      min={Math.max(1, prize.winners.length)}
                      placeholder="Số lượng"
                      value={prize.quantity}
                      onChange={(e) => updatePrize(prize.id, 'quantity', parseInt(e.target.value) || prize.winners.length)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removePrize(prize.id)}
                    disabled={prize.winners.length > 0}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 disabled:opacity-30 disabled:hover:bg-transparent"
                    title={prize.winners.length > 0 ? "Không thể xóa giải đã có người trúng" : "Xóa giải thưởng"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addPrize}
              className="mt-4 px-4 py-2 text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Thêm phần quà
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Spin Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-indigo-800 border border-indigo-200">
                Còn lại: {availableUsers.length} người
              </div>
              
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Đang quay giải:</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-8">
                {currentPrize?.name || 'Chưa có giải thưởng'}
                {currentPrize && (
                  <span className="text-lg font-normal text-indigo-400 ml-2">
                    ({currentPrize.winners.length}/{currentPrize.quantity})
                  </span>
                )}
              </div>

              <div className="mb-8 relative">
                {availableUsers.length > 0 ? (
                  <RouletteWheel 
                    items={availableUsers.map(u => u.name)} 
                    isSpinning={isSpinning} 
                    targetIndex={targetIndex} 
                    duration={spinDuration} 
                    onStop={handleStop} 
                  />
                ) : (
                  <div className="w-64 h-64 mx-auto rounded-full border-8 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Hết người tham gia</p>
                  </div>
                )}
                
                {winner && !isSpinning && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 animate-in zoom-in duration-500 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-emerald-400 text-center transform scale-110 pointer-events-auto">
                      <p className="text-sm text-emerald-500 font-bold uppercase tracking-widest mb-2">🎉 Xin chúc mừng 🎉</p>
                      <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                        {winner.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={startSpin}
                disabled={isSpinning || isWaiting || availableUsers.length === 0 || isPrizeComplete || isEditingPrizes || !currentPrize}
                className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 mx-auto text-xl font-bold shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Đang quay...' : isWaiting ? 'Đang cập nhật...' : 'Bắt đầu quay'}
              </button>
            </div>
          </div>

          {/* Right: Prize Status */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Tiến độ giải thưởng</h3>
            <div className="space-y-4">
              {prizes.map((prize, idx) => {
                const isCurrent = idx === currentPrizeIndex;
                const isDone = prize.winners.length >= prize.quantity;
                
                return (
                  <div 
                    key={prize.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 
                      isDone ? 'bg-white border-emerald-100 opacity-70' : 
                      'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className={`font-medium ${isCurrent ? 'text-indigo-900' : 'text-gray-800'}`}>
                        {prize.name}
                      </p>
                      {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${(prize.winners.length / prize.quantity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-gray-500">
                      {prize.winners.length} / {prize.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Winners List */}
        {prizes.some(p => p.winners.length > 0) && (
          <div className="mt-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Danh sách đã trúng thưởng
            </h3>
            <div className="space-y-6">
              {prizes.filter(p => p.winners.length > 0).map((prize) => (
                <div key={prize.id} className="space-y-3">
                  <h4 className="font-semibold text-indigo-900 border-b border-gray-100 pb-2">
                    {prize.name} <span className="text-gray-500 font-normal text-sm ml-2">({prize.winners.length}/{prize.quantity})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {prize.winners.map((w, idx) => (
                      <div key={w.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-left-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img src={w.avatar} alt={w.name} className="w-6 h-6 rounded-full border border-gray-200 shrink-0" />
                          <p className="font-medium text-sm text-gray-800 truncate">{w.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                <UsersIcon className="w-6 h-6" />
                Danh sách người tham gia hợp lệ ({initialUsers.length})
              </h3>
              <button onClick={() => setShowUsersModal(false)} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {initialUsers.map((u, idx) => {
                  const hasWon = prizes.some(p => p.winners.some(w => w.id === u.id));
                  return (
                    <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${hasWon ? 'bg-emerald-50 border-emerald-200 opacity-70' : 'bg-white border-gray-200'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${hasWon ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {idx + 1}
                      </div>
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm text-gray-800 truncate">{u.name}</p>
                        {hasWon && <p className="text-xs text-emerald-600 font-medium">Đã trúng thưởng</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
