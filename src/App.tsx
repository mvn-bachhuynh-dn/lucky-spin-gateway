import React, { useState, useEffect } from 'react';
import { Post, User, Prize } from './types';
import Step1FetchPosts from './components/Step1FetchPosts';
import Step2SpinPost from './components/Step2SpinPost';
import Step3FetchUsers from './components/Step3FetchUsers';
import Step4ConfigurePrizes from './components/Step4ConfigurePrizes';
import Step5SpinWinners from './components/Step5SpinWinners';
import Step6Results from './components/Step6Results';
import { Gift, Users, ArrowLeft, PlayCircle, ArrowRight } from 'lucide-react';

type AppMode = 'home' | 'prepare' | 'spin';

const loadState = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading state', e);
  }
  return defaultValue;
};

export default function App() {
  const [mode, setMode] = useState<AppMode>(() => loadState('app_mode', 'home'));
  
  const [prepareStep, setPrepareStep] = useState(() => loadState('app_prepareStep', 1));
  const [posts, setPosts] = useState<Post[]>(() => loadState('app_posts', []));
  const [selectedPost, setSelectedPost] = useState<Post | null>(() => loadState('app_selectedPost', null));
  
  const [validUsers, setValidUsers] = useState<User[]>(() => loadState('app_validUsers', []));
  
  const [spinStep, setSpinStep] = useState(() => loadState('app_spinStep', 1));
  const [prizes, setPrizes] = useState<Prize[]>(() => loadState('app_prizes', []));

  useEffect(() => {
    localStorage.setItem('app_mode', JSON.stringify(mode));
    localStorage.setItem('app_prepareStep', JSON.stringify(prepareStep));
    localStorage.setItem('app_posts', JSON.stringify(posts));
    localStorage.setItem('app_selectedPost', JSON.stringify(selectedPost));
    localStorage.setItem('app_validUsers', JSON.stringify(validUsers));
    localStorage.setItem('app_spinStep', JSON.stringify(spinStep));
    localStorage.setItem('app_prizes', JSON.stringify(prizes));
  }, [mode, prepareStep, posts, selectedPost, validUsers, spinStep, prizes]);

  // Prepare Handlers
  const handleNextPrepare1 = (fetchedPosts: Post[]) => {
    setPosts(fetchedPosts);
    setPrepareStep(2);
  };

  const handleNextPrepare2 = (post: Post) => {
    setSelectedPost(post);
    setPrepareStep(3);
  };

  const handleNextPrepare3 = (users: User[]) => {
    setValidUsers(users);
    setMode('home');
    setPrepareStep(1); // Reset prepare steps for next time
  };

  // Spin Handlers
  const handleNextSpin1 = () => {
    setSpinStep(2);
  };

  const handleNextSpin2 = (configuredPrizes: Prize[]) => {
    setPrizes(configuredPrizes);
    setSpinStep(3);
  };

  const handleCompleteSpin = (finalPrizes: Prize[]) => {
    setPrizes(finalPrizes);
    setSpinStep(4);
  };

  const handleResetSpin = () => {
    setSpinStep(1);
    setPrizes([]);
    setMode('home');
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto mt-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quản lý chương trình Giveaway</h2>
        <p className="text-gray-500 text-lg">Chọn chức năng bạn muốn thực hiện</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Module 1 Card */}
        <div 
          onClick={() => setMode('prepare')}
          className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Chuẩn bị danh sách</h3>
          <p className="text-gray-500 mb-6">
            Lấy bài viết, quay ngẫu nhiên chọn 1 bài và lọc ra danh sách những người dùng hợp lệ (đã like, comment, không spam).
          </p>
          <div className="flex items-center text-indigo-600 font-medium">
            Bắt đầu <PlayCircle className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2 Card */}
        <div 
          onClick={() => {
            if (validUsers.length === 0) {
              alert('Vui lòng thực hiện "Chuẩn bị danh sách" trước để có danh sách quay thưởng!');
              return;
            }
            setMode('spin');
          }}
          className={`bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent transition-all group ${
            validUsers.length > 0 
              ? 'hover:border-emerald-500 hover:shadow-xl cursor-pointer' 
              : 'opacity-70 cursor-not-allowed'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform ${
            validUsers.length > 0 ? 'bg-emerald-100 text-emerald-600 group-hover:scale-110' : 'bg-gray-100 text-gray-400'
          }`}>
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Tổ chức quay thưởng</h3>
          <p className="text-gray-500 mb-6">
            Cấu hình các phần quà và tiến hành quay thưởng dựa trên danh sách người dùng đã lọc.
          </p>
          
          {validUsers.length > 0 ? (
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium mb-4 border border-emerald-100">
                Đã lưu {validUsers.length} người tham gia
              </div>
              <div className="flex items-center text-emerald-600 font-medium">
                Bắt đầu <PlayCircle className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ) : (
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
              Chưa có danh sách
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const prepareSteps = [
    { id: 1, name: 'Lấy bài viết' },
    { id: 2, name: 'Chọn bài' },
    { id: 3, name: 'Lọc người dùng' },
  ];

  const spinSteps = [
    { id: 1, name: 'Xem danh sách' },
    { id: 2, name: 'Cấu hình quà' },
    { id: 3, name: 'Quay thưởng' },
    { id: 4, name: 'Kết quả' },
  ];

  const renderStepper = (steps: any[], currentStep: number) => (
    <div className="mb-10 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex items-center justify-between min-w-[400px] max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep === s.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                    : currentStep > s.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {currentStep > s.id ? '✓' : s.id}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                currentStep === s.id ? 'text-indigo-600' : currentStep > s.id ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                {s.name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                currentStep > s.id ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderReviewUsers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 flex items-center gap-2">
          <Users className="text-indigo-600" />
          Danh sách người tham gia đã lưu
        </h2>
        <p className="text-gray-500 mb-6">Đây là danh sách những người dùng hợp lệ đã được lọc từ bước chuẩn bị.</p>
        
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6 flex items-center justify-between">
          <div>
            <p className="text-emerald-800 font-medium">Tổng số người tham gia hợp lệ:</p>
            <p className="text-3xl font-bold text-emerald-600">{validUsers.length}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {validUsers.map((user, idx) => (
            <div key={user.id} className="p-3 border border-gray-100 rounded-xl flex items-center gap-4 bg-gray-50 hover:bg-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white border border-gray-200 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNextSpin1}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
        >
          Tiếp tục cấu hình quà <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mode !== 'home' && (
              <button 
                onClick={() => setMode('home')}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                title="Quay lại trang chủ"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Gift className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Lucky Spin Giveaway
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {mode === 'home' ? 'Admin Dashboard' : mode === 'prepare' ? 'Chuẩn bị danh sách' : 'Tổ chức quay thưởng'}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'home' && renderHome()}

        {mode === 'prepare' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStepper(prepareSteps, prepareStep)}
            <div className="transition-all duration-500 ease-in-out">
              {prepareStep === 1 && <Step1FetchPosts onNext={handleNextPrepare1} />}
              {prepareStep === 2 && <Step2SpinPost posts={posts} onNext={handleNextPrepare2} />}
              {prepareStep === 3 && selectedPost && (
                <Step3FetchUsers 
                  post={selectedPost} 
                  onNext={handleNextPrepare3} 
                  nextLabel="Lưu danh sách & Về trang chủ"
                />
              )}
            </div>
          </div>
        )}

        {mode === 'spin' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStepper(spinSteps, spinStep)}
            <div className="transition-all duration-500 ease-in-out">
              {spinStep === 1 && renderReviewUsers()}
              {spinStep === 2 && <Step4ConfigurePrizes onNext={handleNextSpin2} />}
              {spinStep === 3 && <Step5SpinWinners prizes={prizes} users={validUsers} onComplete={handleCompleteSpin} />}
              {spinStep === 4 && <Step6Results prizes={prizes} onReset={handleResetSpin} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
