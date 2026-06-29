import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { R3FGlobe } from '../../components/R3FGlobe';
import { DestinationPanel } from '../../components/DestinationPanel';
import { dbService } from '../../firebase/services';
import type { SeedDestination } from '../../data/dbSeed';

export const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<SeedDestination[]>([]);
  const [activeGlobeDest, setActiveGlobeDest] = useState<SeedDestination | null>(null);

  useEffect(() => {
    const fetchDests = async () => {
      const list = await dbService.getDestinations();
      setDestinations(list);
    };
    fetchDests();
  }, []);

  return (
    <div className="fixed inset-0 z-[1200] bg-[#030303]">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 md:top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md text-white/70 hover:text-white transition-all text-sm font-medium tracking-wide uppercase"
      >
        <X className="w-4 h-4" /> Back to Earth
      </button>
      
      <div className="absolute inset-0 z-0">
        <R3FGlobe 
          destinations={destinations} 
          onDestinationSelect={(dest: SeedDestination) => setActiveGlobeDest(dest)}
          selectedDestination={activeGlobeDest}
        />
      </div>

      <AnimatePresence>
        {activeGlobeDest && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 right-12 z-50 w-96 pointer-events-auto"
          >
            <DestinationPanel 
              destination={activeGlobeDest}
              onClose={() => setActiveGlobeDest(null)}
              onStartJourney={(dest: SeedDestination) => {
                // For v2, we'll navigate to the journey page (to be implemented)
                // navigate(`/destination/${dest.id}`);
                console.log("Start journey for", dest.title);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

