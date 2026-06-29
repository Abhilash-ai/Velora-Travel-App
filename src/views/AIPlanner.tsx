import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Bot, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { startTravelChat } from '../lib/gemini';

interface AIPlannerProps {
  onClose: () => void;
  prefilledDestination?: string;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ onClose, prefilledDestination = '' }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hello! I am Velora, your elite travel concierge. Where are you dreaming of going today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = startTravelChat();
    
    if (prefilledDestination) {
      handleSend(`I want to explore ${prefilledDestination}. Can you plan a luxurious 3-day itinerary for me?`);
    }
  }, [prefilledDestination]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (forcedInput?: string) => {
    const text = forcedInput || input;
    if (!text.trim()) return;

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = startTravelChat();
      }
      
      const result = await chatSessionRef.current.sendMessage(text);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      // Aggressive mock fallback if the real API key is invalid or fails
      const destinationMatch = text.match(/explore\s+([^.]+)/i);
      const destinationName = destinationMatch ? destinationMatch[1].trim() : "your destination";

      const mockResponse = `
### Your Luxurious Getaway to ${destinationName}

That sounds like a spectacular choice! As your elite concierge, here is a curated taste of what your journey could look like:

**Morning**
Start your day with a private, exclusive guided tour of the local wonders. 

**Afternoon**
Indulge in a world-class culinary experience at a highly sought-after restaurant.

**Evening**
Relax at your premium 5-star suite with breathtaking views.

*(Note: I am falling back to prototype mode due to an API connection error, but I can assure you the real experience is purely magical.)*
`;

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: mockResponse
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-50 w-full max-w-4xl mx-auto rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] mt-12"
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Velora AI Planner</h2>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0 shadow-sm mt-1">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] p-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none prose prose-blue prose-sm md:prose-base max-w-none'
            }`}>
              {m.role === 'model' ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
            
            {m.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 shrink-0 shadow-sm mt-1">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0 shadow-sm mt-1">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-full p-2 pr-4 shadow-inner"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., Plan a 5-day romantic trip to Santorini..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-slate-700 placeholder-slate-400"
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
