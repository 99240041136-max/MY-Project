import { LayoutDashboard, BookOpen, MessageSquare, Settings, GraduationCap, Bell, Search, UserCircle, Zap, Globe, Volume2, Sparkles, LogOut, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const studyData = [
  { day: 'Mon', mins: 45 },
  { day: 'Tue', mins: 52 },
  { day: 'Wed', mins: 38 },
  { day: 'Thu', mins: 65 },
  { day: 'Fri', mins: 48 },
  { day: 'Sat', mins: 20 },
  { day: 'Sun', mins: 0 },
];
import { AIMentor } from './AIMentor';
import { LearningPath, modules } from './LearningPath';
import { Quiz } from './Quiz';
import { SettingsModal } from './SettingsModal';
import { Courses } from './Courses';
import { PricingModal } from './PricingModal';
import { NotificationsModal } from './NotificationsModal';
import { ModuleDetail } from './ModuleDetail';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { LearningModule } from '../types';
import React, { useState, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';

interface DashboardProps {
  user: { 
    name: string; 
    email: string; 
    category?: string; 
    progress?: number; 
    streak?: number; 
    interactions?: number;
    education?: string;
  } | null;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [studyHistory, setStudyHistory] = useState<{ day: string; mins: number }[]>([]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const [sessionStats, setSessionStats] = useState({
    progress: user?.progress || 0,
    streak: user?.streak || 0,
    interactions: user?.interactions || 0,
    studyMinutes: 0,
    dailyGoalMinutes: user?.category === 'Beginner' ? 30 : user?.category === 'Advanced' ? 120 : 60
  });

  const [timerActive, setTimerActive] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [goalAchieved, setGoalAchieved] = useState(false);

  const fetchStudyHistory = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`/api/study-logs/${user.email}`);
      if (response.ok) {
        const logs = await response.json();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedLogs = logs.map((log: any) => ({
          day: days[new Date(log.date).getDay()],
          mins: log.mins
        }));
        setStudyHistory(formattedLogs);
      }
    } catch (error) {
      console.error("Failed to fetch study history:", error);
    }
  };

  React.useEffect(() => {
    fetchStudyHistory();
  }, [user?.email]);

  React.useEffect(() => {
    if (sessionStats.studyMinutes >= sessionStats.dailyGoalMinutes && !goalAchieved) {
      setGoalAchieved(true);
      showToast('🎉 Daily Goal Achieved! Great job!');
      const newStats = { ...sessionStats, streak: sessionStats.streak + 1 };
      setSessionStats(newStats);
      saveStats(newStats);
    }
  }, [sessionStats.studyMinutes, sessionStats.dailyGoalMinutes, goalAchieved]);

  const logStudyTime = async (minutes: number) => {
    if (!user?.email) return;
    try {
      await fetch('/api/study-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, minutes })
      });
      fetchStudyHistory();
    } catch (error) {
      console.error("Failed to log study time:", error);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setSessionStats(prev => ({
          ...prev,
          studyMinutes: prev.studyMinutes + 1
        }));
        logStudyTime(1);
      }, 60000); // Increment every minute
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const saveStats = async (newStats: typeof sessionStats) => {
    if (!user?.email) return;
    try {
      await fetch('/api/user/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          education: user.education,
          category: user.category,
          ...newStats
        })
      });
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  };

  const handleAIMessage = () => {
    const newStats = {
      ...sessionStats,
      interactions: sessionStats.interactions + 1
    };
    setSessionStats(newStats);
    saveStats(newStats);
  };

  const handleModuleClick = (id: string) => {
    if (id === 'all') {
      setActiveTab('Courses');
      return;
    }
    
    const newStats = {
      ...sessionStats,
      progress: Math.min(100, sessionStats.progress + 5)
    };
    setSessionStats(newStats);
    saveStats(newStats);
    
    // Visual feedback
    const module = modules.find(m => m.id === id);
    if (module) {
      setActiveModule({ ...module, progress: newStats.progress });
    }
  };

  const handleTTS = () => {
    const textToRead = `Welcome back ${user?.name || 'Learner'}. You are making great progress. Your course progress is ${sessionStats.progress} percent.`;
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      showToast('Speaking dashboard summary...');
    } else {
      showToast('Text-to-speech is not supported in your browser.');
    }
  };

  const renderContent = () => {
    if (activeModule) {
      return (
        <ModuleDetail 
          module={activeModule} 
          onBack={() => setActiveModule(null)}
          onShowToast={showToast}
          onComplete={() => {
            handleModuleClick(activeModule.id);
            setActiveModule(null);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'Courses':
        return <Courses searchQuery={searchQuery} onShowToast={showToast} />;
      case 'AI Mentor':
        return (
          <div className="h-[calc(100vh-12rem)]">
            <AIMentor userCategory={user?.category} onMessageSent={handleAIMessage} />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('welcome')}, {user?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
                <p className="text-zinc-500 mt-1">You're making great progress. Keep it up!</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t('daily_goal')}</p>
                  <p className="text-sm font-semibold text-zinc-900">{sessionStats.studyMinutes} / {sessionStats.dailyGoalMinutes} mins</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label={t('progress')} value={`${sessionStats.progress}%`} sub="Modules in progress" />
              <StatCard label={t('streak')} value={sessionStats.streak.toString()} sub="Days in a row" />
              <StatCard label={t('study_time')} value={`${sessionStats.studyMinutes}m`} sub="Focus time today" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-amber-500" />
                  {t('quick_actions')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <ActionButton 
                    icon={<Globe size={18} />} 
                    label={t('translate')} 
                    onClick={() => {
                      showToast('Translation feature activated! Select a language in settings.');
                      setShowSettings(true);
                    }} 
                  />
                  <ActionButton 
                    icon={<Volume2 size={18} />} 
                    label={t('tts')} 
                    onClick={handleTTS} 
                  />
                  <ActionButton 
                    icon={<GraduationCap size={18} />} 
                    label={t('quiz')} 
                    onClick={() => setShowQuiz(true)}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                    <Sparkles size={20} className="text-emerald-500" />
                    {t('focus_tools')}
                  </h3>
                  <button 
                    onClick={() => setTimerActive(!timerActive)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                      timerActive 
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    )}
                  >
                    {timerActive ? 'Stop Session' : 'Start Session'}
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Current Session</p>
                    <p className="text-xl font-bold text-zinc-900">{timerActive ? 'Focusing...' : 'Ready to study?'}</p>
                  </div>
                  <div className="flex-1 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Mood</p>
                    <div className="flex gap-2">
                      {['😊', '🤔', '😴', '🔥'].map(emoji => (
                        <button 
                          key={emoji}
                          onClick={() => {
                            setMood(emoji);
                            showToast(`Feeling ${emoji}! Keep going!`);
                          }}
                          className={cn(
                            "text-lg hover:scale-125 transition-transform",
                            mood === emoji ? "scale-125" : "opacity-50"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-500">Ambient Sounds</p>
                  <div className="flex gap-2">
                    {['Lo-fi', 'Rain', 'Forest'].map(sound => (
                      <button 
                        key={sound}
                        onClick={() => showToast(`Playing ${sound} sounds...`)}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-medium transition-colors"
                      >
                        {sound}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-500" />
                  Weekly Study Analytics
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studyHistory.length > 0 ? studyHistory : studyData}>
                      <defs>
                        <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#94a3b8' }} 
                      />
                      <YAxis 
                        hide 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="mins" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMins)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <LearningPath 
              progress={sessionStats.progress}
              onModuleClick={handleModuleClick} 
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
        <AnimatePresence>
          {showQuiz && <Quiz key="quiz-modal" onClose={() => setShowQuiz(false)} />}
          {showSettings && <SettingsModal key="settings-modal" onClose={() => setShowSettings(false)} />}
          {showPricing && <PricingModal key="pricing-modal" onClose={() => setShowPricing(false)} />}
          {showNotifications && <NotificationsModal key="notifications-modal" onClose={() => setShowNotifications(false)} />}
          {toast && (
            <motion.div
              key="toast-notification"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3 border border-white/10"
            >
              <Sparkles size={18} className="text-emerald-400" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900">EduQuest</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label={t('dashboard')} 
            active={activeTab === 'Dashboard'} 
            onClick={() => {
              setActiveTab('Dashboard');
              setActiveModule(null);
            }} 
          />
          <NavItem 
            icon={<BookOpen size={18} />} 
            label={t('courses')} 
            active={activeTab === 'Courses'} 
            onClick={() => {
              setActiveTab('Courses');
              setActiveModule(null);
            }} 
          />
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label={t('mentor')} 
            active={activeTab === 'AI Mentor'} 
            onClick={() => {
              setActiveTab('AI Mentor');
              setActiveModule(null);
            }} 
          />
          <NavItem 
            icon={<Settings size={18} />} 
            label={t('settings')} 
            active={activeTab === 'Settings'} 
            onClick={() => setShowSettings(true)} 
          />
        </nav>

        <div className="px-4 py-2">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Pro Plan</p>
            <p className="text-sm text-zinc-600 mb-3">Unlock advanced AI tutoring and offline access.</p>
            <button 
              onClick={() => setShowPricing(true)}
              className="w-full py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            {(activeTab !== 'Dashboard' || activeModule) && (
              <button 
                onClick={() => {
                  if (activeModule) setActiveModule(null);
                  else setActiveTab('Dashboard');
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-bold hidden sm:inline">Back</span>
              </button>
            )}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')} 
                className="w-full bg-zinc-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200 mx-2"></div>
            
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-1 pr-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600">
                  <UserCircle size={24} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-zinc-900">{user?.name || 'Learner'}</p>
                  <p className="text-[10px] text-zinc-500">{user?.category || 'Intermediate'} Learner</p>
                </div>
              </div>
              
              <button 
                onClick={onLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Content Area */}
          <div className={cn(
            "space-y-8 transition-all duration-500",
            (activeTab === 'AI Mentor' || activeModule) ? "lg:col-span-12" : "lg:col-span-7"
          )}>
            {renderContent()}
          </div>

          {/* Right Column: AI Mentor (Only on Dashboard) */}
          {activeTab === 'Dashboard' && !activeModule && (
            <div className="lg:col-span-5 h-[calc(100vh-12rem)] sticky top-24">
              <AIMentor userCategory={user?.category} onMessageSent={handleAIMessage} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      active 
        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" 
        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
    )}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
  <motion.div 
    whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
    className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm transition-all duration-300"
  >
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
    <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
    <p className="text-xs text-zinc-500 mt-1 font-medium">{sub}</p>
  </motion.div>
);

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
  >
    <div className="p-3 rounded-2xl bg-white text-zinc-600 group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-300 mb-3 shadow-sm border border-zinc-50">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 text-center transition-colors">{label}</span>
  </button>
);
