import React from 'react';
import { X, Check, Zap, Shield, Star, Globe, MessageSquare, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const PricingModal = ({ onClose }: { onClose: () => void }) => {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => {
      alert('Subscription successful! Welcome to EduQuest Pro.');
      onClose();
    }, 1000);
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
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        <div className="p-10 bg-zinc-50 border-r border-zinc-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold text-lg text-zinc-900">EduQuest Pro</span>
          </div>
          
          <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Level up your learning.</h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">Get unlimited access to advanced AI features, personalized curriculums, and offline learning tools.</p>
          
          <div className="space-y-4">
            <FeatureItem icon={<Zap className="text-amber-500" />} text="Unlimited AI Mentor interactions" />
            <FeatureItem icon={<Globe className="text-emerald-500" />} text="Real-time translation in 50+ languages" />
            <FeatureItem icon={<MessageSquare className="text-blue-500" />} text="Priority access to new AI models" />
            <FeatureItem icon={<Shield className="text-purple-500" />} text="Ad-free learning experience" />
            <FeatureItem icon={<Star className="text-amber-400" />} text="Verified completion certificates" />
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center items-center text-center">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>

          <div className="mb-8">
            <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Best Value</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-zinc-900">$12</span>
              <span className="text-zinc-500 font-medium">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Billed annually ($144/year)</p>
          </div>

          <button 
            onClick={handleSubscribe}
            disabled={isSubscribed}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 mb-4 disabled:opacity-70"
          >
            {isSubscribed ? 'Processing...' : 'Start 7-Day Free Trial'}
          </button>
          <p className="text-xs text-zinc-400">No credit card required to start. Cancel anytime.</p>
          
          <div className="mt-12 pt-8 border-t border-zinc-100 w-full">
            <p className="text-sm font-medium text-zinc-900 mb-4">Trusted by students at</p>
            <div className="flex justify-center gap-6 opacity-30 grayscale">
              <div className="font-bold text-xl italic">Stanford</div>
              <div className="font-bold text-xl italic">MIT</div>
              <div className="font-bold text-xl italic">Oxford</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <span className="text-sm font-medium text-zinc-700">{text}</span>
  </div>
);
