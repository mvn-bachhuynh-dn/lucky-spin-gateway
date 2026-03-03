import React, { useState } from 'react';
import { Post } from '../types';
import { generateMockPosts } from '../utils/mockData';
import { Calendar, Search, ArrowRight } from 'lucide-react';

interface Props {
  onNext: (posts: Post[]) => void;
}

export default function Step1FetchPosts({ onNext }: Props) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      const fetchedPosts = generateMockPosts(startDate, endDate);
      setPosts(fetchedPosts);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Bước 1: Lấy danh sách bài viết</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 h-[42px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Lấy dữ liệu
          </button>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Đã tìm thấy {posts.length} bài viết</h3>
            <button
              onClick={() => onNext(posts)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
            {posts.map((post, index) => (
              <div key={post.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium line-clamp-2">{post.content}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
