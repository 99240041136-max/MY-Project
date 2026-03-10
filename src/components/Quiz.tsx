import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the primary goal of inclusive design?",
    options: ["To make things look better", "To ensure products work for everyone", "To reduce manufacturing costs", "To follow legal requirements"],
    correct: 1
  },
  {
    id: 2,
    text: "Which AI model is best for real-time reasoning?",
    options: ["Gemini 3 Flash", "Gemini 1.0", "Legacy models", "Static algorithms"],
    correct: 0
  }
];

export const Quiz = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    if (selected === questions[currentStep].correct) {
      setScore(s => s + 1);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
    }
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
          <h3 className="font-bold text-zinc-900">Knowledge Check</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {!isFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(((currentStep) / questions.length) * 100)}% Complete</span>
              </div>
              
              <h4 className="text-lg font-semibold text-zinc-900 leading-tight">
                {questions[currentStep].text}
              </h4>

              <div className="space-y-3">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={`quiz-option-${idx}`}
                    onClick={() => setSelected(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all ${
                      selected === idx 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/10" 
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                disabled={selected === null}
                onClick={handleNext}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                {currentStep === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-zinc-900">Quiz Completed!</h4>
                <p className="text-zinc-500 mt-2">You scored {score} out of {questions.length}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setSelected(null);
                    setIsFinished(false);
                    setScore(0);
                  }}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={16} /> Retry
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
