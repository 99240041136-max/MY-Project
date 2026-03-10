import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, CheckCircle2, Play, FileText, MessageSquare, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { LearningModule } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface ModuleDetailProps {
  module: LearningModule;
  onBack: () => void;
  onComplete: () => void;
  onShowToast?: (msg: string) => void;
}

export const ModuleDetail = ({ module, onBack, onComplete, onShowToast }: ModuleDetailProps) => {
  const { t } = useLanguage();
  const lessons = [
    { id: 1, title: "Introduction to the Topic", duration: "10 mins", type: "video", completed: true },
    { id: 2, title: "Core Concepts & Principles", duration: "25 mins", type: "reading", completed: module.progress > 50 },
    { id: 3, title: "Practical Application Guide", duration: "40 mins", type: "video", completed: false },
    { id: 4, title: "Module Assessment", duration: "15 mins", type: "quiz", completed: false },
  ];

  const handleComplete = () => {
    onShowToast?.(`Module "${module.title}" marked as complete!`);
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{module.title}</h1>
          <p className="text-zinc-500">Module {module.id} • {lessons.length} Lessons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden relative group cursor-pointer">
            <img 
              src={`https://picsum.photos/seed/${module.id}/1200/800`} 
              alt="Video Preview" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={32} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">{t('about_module')}</h3>
            <p className="text-zinc-600 leading-relaxed mb-6">
              {module.description} This comprehensive module covers everything you need to know to master the fundamentals. 
              You'll learn through a combination of video lectures, interactive readings, and practical exercises designed 
              to reinforce your understanding.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Duration</p>
                <p className="font-bold text-zinc-900">1h 30m Total</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Difficulty</p>
                <p className="font-bold text-zinc-900">Intermediate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-500" />
              {t('course_content')}
            </h3>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div 
                  key={`lesson-${lesson.id}`}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex items-center gap-4 group cursor-pointer",
                    lesson.completed ? "bg-emerald-50/50 border-emerald-100" : "bg-white border-zinc-100 hover:border-zinc-300"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    lesson.completed ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                  )}>
                    {lesson.completed ? <CheckCircle2 size={16} /> : 
                     lesson.type === 'video' ? <Play size={16} /> :
                     lesson.type === 'reading' ? <FileText size={16} /> :
                     <Award size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-bold truncate",
                      lesson.completed ? "text-emerald-900" : "text-zinc-900"
                    )}>{lesson.title}</p>
                    <p className="text-[10px] text-zinc-500">{lesson.duration} • {lesson.type}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleComplete}
              className="w-full mt-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
            >
              {t('mark_complete')}
            </button>
          </div>

          <div className="bg-emerald-900 p-6 rounded-[2rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <MessageSquare className="mb-4 text-emerald-400" size={24} />
              <h4 className="font-bold mb-2">{t('need_help')}</h4>
              <p className="text-xs text-emerald-100/70 mb-4">{t('ask_mentor')}</p>
              <button className="text-xs font-bold py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-md">
                {t('chat_mentor')}
              </button>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
