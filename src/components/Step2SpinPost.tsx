import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { ArrowRight, Dices } from 'lucide-react';
import { playWinSound } from '../utils/audio';
import RouletteWheel from './RouletteWheel';

interface Props {
  posts: Post[];
  onNext: (post: Post) => void;
}

export default function Step2SpinPost({ posts, onNext }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [targetIndex, setTargetIndex] = useState(0);

  const startSpin = () => {
    if (posts.length === 0 || isSpinning) return;
    const finalIndex = Math.floor(Math.random() * posts.length);
    setTargetIndex(finalIndex);
    setIsSpinning(true);
    setSelectedPost(null);
  };

  const handleStop = () => {
    setIsSpinning(false);
    setSelectedPost(posts[targetIndex]);
    playWinSound();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Bước 2: Quay số chọn bài viết</h2>
        <p className="text-gray-500 mb-8">Hệ thống sẽ chọn ngẫu nhiên 1 trong {posts.length} bài viết để quay thưởng.</p>
        
        <div className="mb-8 relative">
          <RouletteWheel 
            items={posts.map((_, i) => `Bài viết ${i + 1}`)} 
            isSpinning={isSpinning} 
            targetIndex={targetIndex} 
            duration={5} 
            onStop={handleStop} 
          />
          
          {selectedPost && !isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center z-20 animate-in zoom-in duration-500 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-2 border-indigo-400 text-center max-w-sm pointer-events-auto">
                <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest mb-2">Đã chọn</p>
                <p className="text-lg font-bold text-gray-800 line-clamp-3">
                  {selectedPost.content}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={startSpin}
          disabled={isSpinning || posts.length === 0}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 mx-auto text-lg font-medium shadow-md hover:shadow-lg"
        >
          <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Đang quay...' : 'Bắt đầu quay'}
        </button>
      </div>

      {selectedPost && !isSpinning && (
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-emerald-800 font-semibold text-lg mb-1">Đã chọn bài viết thành công!</h3>
            <p className="text-emerald-600 text-sm">Sẵn sàng để lấy danh sách người tham gia.</p>
          </div>
          <button
            onClick={() => onNext(selectedPost)}
            className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            Tiếp tục <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
