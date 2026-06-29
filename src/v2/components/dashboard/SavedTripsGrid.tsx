import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Compass } from 'lucide-react';
import type { SeedDestination } from '../../../data/dbSeed';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SavedTripsGridProps {
  destinations: SeedDestination[];
  onBrowseExplore: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } }
} as const;

export const SavedTripsGrid: React.FC<SavedTripsGridProps> = ({ destinations, onBrowseExplore }) => {
  return (
    <motion.section variants={itemVariants}>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <Heart className="w-6 h-6 text-red-500" /> Saved For Later
      </h3>
      
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((dest) => (
            <Card key={dest.id} hoverEffect className="group cursor-pointer h-full flex flex-col">
              <div className="h-56 overflow-hidden relative shrink-0">
                <img 
                  src={dest.image} 
                  alt={dest.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">{dest.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-blue-600 font-bold text-sm">
                  Explore Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 border-dashed">
          <Compass className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No saved destinations yet</h4>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Explore the globe and save your favorite places to plan future trips.</p>
          <Button onClick={onBrowseExplore} size="lg">
            Explore Destinations
          </Button>
        </div>
      )}
    </motion.section>
  );
};
