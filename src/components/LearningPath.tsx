import React from 'react';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { LearningModule } from '../types';
import { cn } from '../lib/utils';

export const modules: LearningModule[] = [
  { id: '1', title: 'Foundations of AI', description: 'Understanding the basics of neural networks and machine learning.', status: 'completed', progress: 100 },
  { id: '2', title: 'Ethics in Technology', description: 'Exploring the societal impact of automated decision making.', status: 'available', progress: 45 },
  { id: '3', title: 'Advanced Data Science', description: 'Mastering complex data visualization and statistical modeling.', status: 'locked', progress: 0 },
  { id: '4', title: 'Inclusive Design', description: 'Building products that work for everyone, everywhere.', status: 'locked', progress: 0 },
];

export const LearningPath = ({ 
  progress, 
  onModuleClick 
}: { 
  progress: number;
  onModuleClick?: (id: string) => void 
}) => {
  const dynamicModules = modules.map((m, idx) => {
    const threshold = (idx + 1) * 25;
    let status: 'completed' | 'available' | 'locked' = 'locked';
    let moduleProgress = 0;

    if (progress >= threshold) {
      status = 'completed';
      moduleProgress = 100;
    } else if (progress >= threshold - 25) {
      status = 'available';
      moduleProgress = ((progress - (threshold - 25)) / 25) * 100;
    }

    return { ...m, status, progress: moduleProgress };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Your Learning Path</h2>
          <p className="text-sm text-zinc-500">Adaptive curriculum based on your goals</p>
        </div>
        <button 
          onClick={() => onModuleClick?.('all')}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid gap-4">
        {dynamicModules.map((module, idx) => (
          <motion.div
            key={`module-${module.id}`}
            onClick={() => module.status !== 'locked' && onModuleClick?.(module.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "group relative p-4 rounded-2xl border transition-all duration-200",
              module.status === 'completed' ? "bg-emerald-50/30 border-emerald-100 cursor-pointer" : 
              module.status === 'available' ? "bg-white border-zinc-200 hover:border-emerald-300 hover:shadow-md cursor-pointer" :
              "bg-zinc-50 border-zinc-100 opacity-60 grayscale cursor-not-allowed"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                module.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                module.status === 'available' ? "bg-zinc-100 text-zinc-600 group-hover:bg-emerald-100 group-hover:text-emerald-600" :
                "bg-zinc-200 text-zinc-400"
              )}>
                {module.status === 'completed' ? <CheckCircle2 size={20} /> : 
                 module.status === 'locked' ? <Lock size={20} /> : 
                 <BookOpen size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-zinc-900 truncate">{module.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {module.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-1 mb-3">{module.description}</p>
                
                <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    className={cn(
                      "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                      module.status === 'completed' ? "bg-emerald-500" : "bg-emerald-400"
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
