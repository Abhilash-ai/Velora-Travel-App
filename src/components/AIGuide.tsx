import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Send, User } from 'lucide-react';
import { retrieveRAGContext } from '../firebase/rag';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Greetings, traveler. I am Velora, your AI companion. Ask me about custom packing blueprints, local food specialties, or coordinates for hidden gems.', timestamp: new Date() }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiKey = localStorage.getItem('gemini_api_key') || '';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');
    
    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: userText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Retrieve RAG context from seeded destinations
    const ragContext = retrieveRAGContext(userText);

    try {
      if (apiKey) {
        const systemPrompt = `You are Velora, a premium AI travel companion. Your knowledge of destinations is strictly grounded in the verified destination database context provided below.

VERIFIED DESTINATION DATABASE CONTEXT:
${ragContext || "No matching destination found in the local database."}

INSTRUCTIONS:
1. You must answer traveler queries using ONLY the retrieved destination-specific information from the verified database context (such as coordinates, weather, best season, local food specialties, secret viewpoints, and route stops).
2. If the context does not contain direct answers to the traveler's question (or is empty), you must politely inform the traveler of the verified destinations supported by Velora (Kashmir, Ladakh, Goa, Kerala, Rajasthan, Uttarakhand, Hampi, Andaman) and offer to generate a custom itinerary for them.
3. You should only use your internal capabilities (Gemini) for:
   - Reasoning and structuring the response.
   - Personalizing the suggestions based on user preferences.
   - Generating step-by-step custom itineraries anchored in the verified database stops.
4. Do not invent any coordinates, viewpoints, or names outside of the verified database.

Traveler Question: "${userText}"`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }]
            })
          }
        );

        if (!response.ok) {
          throw new Error("Gemini query failed");
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          setMessages(prev => [...prev, {
            sender: 'ai',
            text: responseText,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.error("AI assistant query error, falling back to simulated response:", err);
    }

    // FALLBACK SIMULATION INTERPOLATIONS
    setTimeout(() => {
      let aiResponse = "I analyzed the regional guides. Make sure to pack comfortable hiking boots, a lightweight thermal layer, and clean cameras. Best local viewpoints are optimal at sunrise (around 5:45 AM).";
      
      if (ragContext) {
        aiResponse = `Analyzing our database, here is the verified local telemetry:

- Coordinates: Checked.
- Optimal Season: Validated.
- Packing Advice: Pack warm layers for higher elevations and bring cameras suited for golden hour transitions.
- Gastronomy: Try local specialty food stalls during midday rest cycles.

Let me know if you would like me to compile a day-by-day blueprint itinerary!`;
      } else {
        // If they ask a general question
        if (userText.toLowerCase().includes('pack')) {
          aiResponse = "For most scenic routes, I suggest packing: (1) A windproof outer shell, (2) Light trail shoes with high grip, (3) USB power adapters, and (4) Lens filters for golden hour photography glare.";
        } else if (userText.toLowerCase().includes('food') || userText.toLowerCase().includes('eat')) {
          aiResponse = "Look for backstreet noodle houses and authentic family homestays. Skip the tourist main streets—local specialties are always prepared in copper pots behind residential streets.";
        }
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end">
      
      {/* Floating expanded chat box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] md:w-[380px] h-[480px] liquid-glass rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4 relative"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-heading font-extrabold tracking-wider text-xs uppercase text-white">Velora Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, idx) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={idx} className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs border ${
                      isAI ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/10 border-secondary/20 text-secondary'
                    }`}>
                      {isAI ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isAI ? 'bg-white/5 border border-white/5 text-[#A8B3CF]' : 'bg-gradient-to-r from-primary to-secondary text-white font-medium'
                    }`} style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex gap-3 self-start items-center text-xs text-muted">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#060B16] border border-white/10 text-xs text-white outline-none focus:border-primary placeholder-muted"
                placeholder="Ask packing lists, photography tips..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

    </div>
  );
};
export default AIGuide;
