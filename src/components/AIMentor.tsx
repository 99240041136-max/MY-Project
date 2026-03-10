import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { getAI, SYSTEM_INSTRUCTION } from '../services/gemini';
import { Message } from '../types';
import { cn } from '../lib/utils';

interface AIMentorProps {
  userCategory?: string;
  onMessageSent?: () => void;
}

export const AIMentor = ({ userCategory = 'Intermediate', onMessageSent }: AIMentorProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-welcome-message',
      role: 'model',
      text: `Hello! I'm your EduQuest AI mentor. I see you're at the **${userCategory}** level. What would you like to learn today? I'll tailor my explanations to your current standard.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const personalizedInstruction = `${SYSTEM_INSTRUCTION}\n\nIMPORTANT: The user is currently at an **${userCategory}** level. Adjust your complexity, vocabulary, and depth of explanation accordingly. If they are a 'Beginner', use simple analogies and avoid jargon. If 'Advanced', provide deeper technical insights and assume foundational knowledge.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    onMessageSent?.();

    try {
      const ai = getAI();
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: personalizedInstruction },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: input });
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'model',
        text: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'model',
        text: "I encountered an error. Please check your connection or try again later.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="p-4 border-bottom border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">AI Mentor</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Always Online</p>
          </div>
        </div>
        <Sparkles size={16} className="text-amber-400" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                m.role === 'user' ? "bg-zinc-100 text-zinc-600" : "bg-emerald-100 text-emerald-600"
              )}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-zinc-900 text-white rounded-tr-none" 
                  : "bg-zinc-50 text-zinc-800 border border-zinc-100 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
              <Bot size={16} />
            </div>
            <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-2xl rounded-tl-none">
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 mt-2 text-center">
          EduQuest AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};
