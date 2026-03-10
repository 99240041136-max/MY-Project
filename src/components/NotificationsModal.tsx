import React from 'react';
import { Bell, CheckCircle2, Info, AlertCircle, Clock, X } from 'lucide-react';
import { motion } from 'motion/react';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Quiz Completed',
    message: 'You scored 100% on the AI Ethics quiz! Keep it up.',
    time: '2 mins ago',
    icon: <CheckCircle2 size={16} className="text-emerald-500" />
  },
  {
    id: 2,
    type: 'info',
    title: 'New Course Available',
    message: 'Advanced Data Science is now open for enrollment.',
    time: '1 hour ago',
    icon: <Info size={16} className="text-blue-500" />
  },
  {
    id: 3,
    type: 'warning',
    title: 'Study Streak at Risk',
    message: 'Complete a module today to maintain your 12-day streak!',
    time: '3 hours ago',
    icon: <AlertCircle size={16} className="text-amber-500" />
  }
];

export const NotificationsModal = ({ onClose }: { onClose: () => void }) => {
  const [items, setItems] = React.useState(notifications);

  const markAllAsRead = () => {
    setItems([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-zinc-900" />
            <h3 className="font-bold text-zinc-900">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((n) => (
                <div key={`notification-${n.id}`} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-zinc-200 transition-all cursor-pointer group">
                  <div className="flex gap-3">
                    <div className="mt-1">{n.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-zinc-900">{n.title}</h4>
                        <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                          <Clock size={10} /> {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Bell size={40} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-zinc-500 font-medium">No new notifications</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-100">
          <button 
            onClick={markAllAsRead}
            disabled={items.length === 0}
            className="w-full py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
