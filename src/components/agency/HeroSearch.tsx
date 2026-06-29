import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSearchProps {
  onSearch: (query: { destination: string; dates: string; guests: string }) => void;
  onOpenGlobe?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, onOpenGlobe }) => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          poster="/images/uttarakhand.png"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center gap-8 text-center mt-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mix-blend-overlay drop-shadow-2xl"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
        >
          Discover Your Next Adventure
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/90 max-w-2xl font-medium drop-shadow"
        >
          Explore beautiful destinations, create unforgettable memories, and book your dream vacation with Velora.
        </motion.p>

        {/* Search Bar Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl bg-white rounded-2xl md:rounded-full shadow-2xl p-2 md:p-3 mt-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Destination */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 w-full flex-1">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase">Where to?</span>
                <input 
                  type="text" 
                  placeholder="e.g. Paris, Bali..." 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full outline-none text-slate-900 font-medium bg-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 w-full flex-1">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase">Dates</span>
                <input 
                  type="text" 
                  placeholder="Add dates" 
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full outline-none text-slate-900 font-medium bg-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 w-full flex-1">
              <Users className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase">Guests</span>
                <input 
                  type="text" 
                  placeholder="2 adults" 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full outline-none text-slate-900 font-medium bg-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto px-2 pb-2 md:pb-0 pt-2 md:pt-0">
              <button 
                onClick={() => onSearch({ destination, dates, guests })}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 md:px-8 md:py-4 rounded-xl md:rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </motion.div>

        {onOpenGlobe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <button 
              onClick={onOpenGlobe}
              className="px-8 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-3 mx-auto shadow-xl"
            >
              <Globe2 className="w-5 h-5" />
              <span className="font-semibold tracking-wide">Explore 3D Globe</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
