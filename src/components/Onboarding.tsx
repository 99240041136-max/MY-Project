import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, Brain, ArrowRight, CheckCircle2, Award, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAI } from '../services/gemini';
import { Type } from "@google/genai";

interface OnboardingProps {
  onComplete: (data: { education: string; category: string; score: number }) => void;
  user: { name: string; email: string };
}

const educationLevels = [
  { id: 'high-school', label: 'High School', icon: <GraduationCap size={20} /> },
  { id: 'undergraduate', label: 'Undergraduate', icon: <BookOpen size={20} /> },
  { id: 'graduate', label: 'Graduate / Professional', icon: <Award size={20} /> },
];

interface Question {
  question: string;
  options: string[];
  correct: number;
}

export const Onboarding = ({ onComplete, user }: OnboardingProps) => {
  const [step, setStep] = useState<'education' | 'loading' | 'quiz' | 'result'>('education');
  const [education, setEducation] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dynamicQuiz, setDynamicQuiz] = useState<Question[]>([]);

  const generateQuiz = async (level: string) => {
    setStep('loading');
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 unique multiple-choice questions for a student at the ${level} level. The questions should be challenging but appropriate for their education. Return the response as a JSON array of objects, each having 'question' (string), 'options' (array of 4 strings), and 'correct' (integer index 0-3).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correct: { type: Type.INTEGER }
              },
              required: ["question", "options", "correct"]
            }
          }
        }
      });

      const quiz = JSON.parse(response.text);
      setDynamicQuiz(quiz);
      setStep('quiz');
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      // Fallback to static data if AI fails
      const fallback: Record<string, Question[]> = {
        'high-school': [
          { question: "What is the formula for the area of a circle?", options: ["πr²", "2πr", "πd", "r²"], correct: 0 },
          { question: "Which of these is a prime number?", options: ["4", "9", "11", "15"], correct: 2 },
          { question: "What is the chemical symbol for water?", options: ["CO2", "H2O", "O2", "NaCl"], correct: 1 },
        ],
        'undergraduate': [
          { question: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"], correct: 0 },
          { question: "Which data structure uses LIFO (Last-In-First-Out)?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1 },
          { question: "What is the main purpose of an Operating System?", options: ["To browse the web", "To manage hardware and software", "To write code", "To design graphics"], correct: 1 },
        ],
        'graduate': [
          { question: "In Bayesian statistics, what is the 'prior'?", options: ["The result of the experiment", "Initial belief before seeing data", "The likelihood function", "The margin of error"], correct: 1 },
          { question: "What does NP-complete mean in computational complexity?", options: ["Non-Polynomial time", "Solvable in linear time", "Hardest problems in NP", "Not Provable"], correct: 2 },
          { question: "What is the primary goal of Gradient Descent?", options: ["To maximize a function", "To find the local minimum of a function", "To sort data", "To encrypt data"], correct: 1 },
        ],
      };
      setDynamicQuiz(fallback[level] || fallback['high-school']);
      setStep('quiz');
    }
  };

  const handleEducationSelect = (id: string) => {
    setEducation(id);
    generateQuiz(id);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestion < dynamicQuiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep('result');
      }
    }
  };

  const calculateResults = () => {
    const questions = dynamicQuiz;
    const correctCount = answers.reduce((acc, curr, idx) => {
      return curr === questions[idx].correct ? acc + 1 : acc;
    }, 0);
    
    let category = 'Beginner';
    if (correctCount === questions.length) category = 'Advanced';
    else if (correctCount >= questions.length / 2) category = 'Intermediate';

    return { score: correctCount, total: questions.length, category };
  };

  const { score, total, category } = step === 'result' ? calculateResults() : { score: 0, total: 0, category: '' };

  const handleComplete = async () => {
    const onboardingData = { education, category, score };
    try {
      await fetch('/api/user/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          ...onboardingData,
          progress: Math.floor(Math.random() * 20) + 10, // Initial progress
          streak: 1,
          interactions: 0
        })
      });
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
    onComplete(onboardingData);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 p-8 lg:p-12 border border-zinc-100"
      >
        <AnimatePresence mode="wait">
          {step === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">Welcome, {user.name}!</h2>
                <p className="text-zinc-500">To personalize your learning journey, tell us about your education.</p>
              </div>

              <div className="grid gap-4">
                {educationLevels.map((level) => (
                  <button
                    key={`edu-${level.id}`}
                    onClick={() => handleEducationSelect(level.id)}
                    className="flex items-center gap-4 p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-600 group-hover:text-emerald-600 transition-colors shadow-sm">
                      {level.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{level.label}</h4>
                      <p className="text-sm text-zinc-500">I have completed my {level.label} studies.</p>
                    </div>
                    <ArrowRight className="ml-auto text-zinc-300 group-hover:text-emerald-500 transition-colors" size={20} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-full h-full text-zinc-900 animate-spin" />
                <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900">Generating Assessment</h3>
                <p className="text-zinc-500">Our AI is crafting unique questions just for you...</p>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && dynamicQuiz.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setStep('education')}
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <Brain className="text-emerald-500" size={24} />
                  <span className="font-bold text-zinc-900">Assessment</span>
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Question {currentQuestion + 1} of {dynamicQuiz.length}
                </span>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-zinc-900 leading-tight">
                  {dynamicQuiz[currentQuestion].question}
                </h3>

                <div className="grid gap-3">
                  {dynamicQuiz[currentQuestion].options.map((option, idx) => (
                    <button
                      key={`option-${idx}`}
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "w-full p-5 rounded-2xl border text-left font-medium transition-all",
                        selectedOption === idx 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-500/5" 
                          : "border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 text-zinc-600"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  disabled={selectedOption === null}
                  onClick={handleNextQuestion}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {currentQuestion === dynamicQuiz.length - 1 ? 'Finish Assessment' : 'Next Question'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <CheckCircle2 size={48} />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-400 rounded-full blur-2xl opacity-20"
                ></motion.div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">Assessment Complete!</h2>
                <p className="text-zinc-500">We've analyzed your results to tailor your experience.</p>
              </div>

              <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Your Score</p>
                    <p className="text-4xl font-bold text-zinc-900">{score} / {total}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Assigned Level</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <Sparkles size={20} />
                      <p className="text-xl font-bold">{category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
              >
                Enter Dashboard
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
