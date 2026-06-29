import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, PlaneTakeoff } from 'lucide-react';
import type { SeedDestination } from '../../../data/dbSeed';

interface UpcomingJourneyProps {
  destination: SeedDestination;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } }
} as const;

export const UpcomingJourney: React.FC<UpcomingJourneyProps> = ({ destination }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <motion.section variants={itemVariants} ref={containerRef}>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <PlaneTakeoff className="w-6 h-6 text-blue-600" /> Upcoming Journey
      </h3>
      
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[450px] group border border-white/20">
        {/* Parallax Image */}
        <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none">
          <motion.img 
            style={{ y: parallaxY }}
            src={destination.image} 
            alt={destination.title} 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-bold text-sm mb-4 w-max">
            <MapPin className="w-4 h-4" /> {destination.country}
          </div>
          <h4 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            {destination.title}
          </h4>
          <p className="text-blue-100 mb-8 font-medium max-w-lg text-lg">
            Your premium itinerary is finalized. Departure in 14 days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl">
              View Itinerary
            </button>
            <button className="bg-slate-900/50 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 hover:bg-slate-900/70 transition-colors">
              Manage Booking
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
