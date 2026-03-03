import React, { useState } from 'react';
import { Post, User } from '../types';
import { generateMockUsers } from '../utils/mockData';
import { Users, Filter, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  post: Post;
  onNext: (users: User[]) => void;
  nextLabel?: string;
}

export default function Step3FetchUsers({ post, onNext, nextLabel }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      const fetchedUsers = generateMockUsers(post);
      setUsers(fetchedUsers);
      setHasFetched(true);
      setLoading(false);
    }, 1500);
  };

  const validUsers = users.filter(u => u.isValid);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Bước 3: Lấy danh sách người tham gia</h2>
        <p className="text-gray-500 mb-6">Lấy danh sách những người đã tương tác với bài viết được chọn.</p>
        
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
          <p className="text-sm text-gray-500 mb-1">Bài viết đang chọn:</p>
          <p className="font-medium text-gray-800">{post.content}</p>
        </div>

        {!hasFetched ? (
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Users className="w-5 h-5" />
            )}
            {loading ? 'Đang phân tích dữ liệu...' : 'Lấy danh sách & Lọc hợp lệ'}
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <p className="text-indigo-900 font-semibold">Đã lọc xong!</p>
                <p className="text-indigo-700 text-sm">
                  Tổng: {users.length} | Hợp lệ: <span className="font-bold">{validUsers.length}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNext(validUsers)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm font-medium"
            >
              {nextLabel || 'Tiếp tục'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {hasFetched && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Chi tiết danh sách</h3>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {users.map((user) => (
              <div key={user.id} className={`p-3 border rounded-xl flex items-center justify-between gap-4 ${user.isValid ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white border border-gray-200" />
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <div className="flex gap-2 text-xs mt-1">
                      <span className={user.hasReacted ? 'text-emerald-600' : 'text-red-500'}>
                        {user.hasReacted ? '👍 Đã Like' : '❌ Chưa Like'}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className={user.hasCommented ? 'text-emerald-600' : 'text-red-500'}>
                        {user.hasCommented ? `💬 ${user.commentCount} Bình luận` : '❌ Chưa BL'}
                      </span>
                      {user.isSpam && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-red-500 font-medium">⚠️ Spam</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {user.isValid ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
