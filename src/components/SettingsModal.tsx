import React from 'react';
import { X, Globe, Type, Eye, Volume2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = React.useState('M');
  const [highContrast, setHighContrast] = React.useState(false);
  const [screenReader, setScreenReader] = React.useState(true);

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
          <h3 className="font-bold text-zinc-900">{t('settings')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Language & Region</h4>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-zinc-500" />
                <span className="text-sm font-medium">Preferred Language</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-sm font-semibold focus:outline-none"
              >
                <option value="English">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Visuals</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <Type size={18} className="text-zinc-500" />
                  <span className="text-sm font-medium">Font Size</span>
                </div>
                <div className="flex gap-2">
                  {['S', 'M', 'L'].map(size => (
                    <button 
                      key={`font-size-${size}`} 
                      onClick={() => setFontSize(size)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${fontSize === size ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <Eye size={18} className="text-zinc-500" />
                  <span className="text-sm font-medium">High Contrast</span>
                </div>
                <button 
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${highContrast ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Audio</h4>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-zinc-500" />
                <span className="text-sm font-medium">Screen Reader Support</span>
              </div>
              <button 
                onClick={() => setScreenReader(!screenReader)}
                className={`w-10 h-5 rounded-full relative transition-colors ${screenReader ? 'bg-emerald-500' : 'bg-zinc-200'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${screenReader ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </section>

          <button 
            onClick={() => {
              alert('Settings saved successfully!');
              onClose();
            }}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
          >
            <Save size={18} /> Save Preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
