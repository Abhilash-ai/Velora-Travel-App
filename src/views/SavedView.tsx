import React, { useRef } from 'react';
import { Heart, MapPin, LogOut, Compass, PlaneTakeoff, Globe, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { destinations } from '../data/destinations';
import { Magnetic } from '../components/ui/Magnetic';

interface SavedViewProps {
  user: any;
  savedIds: string[];
  onBrowseExplore: () => void;
  onLogout: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } }
} as const;

export const SavedView: React.FC<SavedViewProps> = ({
  user,
  savedIds,
  onBrowseExplore,
  onLogout
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const savedDestinations = destinations.filter((d) => savedIds.includes(d.id));
  const upcomingTrip = destinations[0]; // Simulated

  // Simple parallax for the Upcoming Journey image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <div ref={containerRef} className="bg-[#f8fafc] min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Sidebar Profile */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-4 space-y-6"
        >
          {/* Main Identity Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600" />
            
            <div className="relative z-10">
              <div className="w-28 h-28 bg-white border-4 border-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black shadow-xl mt-6 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'V'
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || 'VIP Traveler'}</h2>
              <p className="text-sm font-medium text-blue-600 mb-8 uppercase tracking-widest">{user?.phoneNumber || 'Premium Member'}</p>
              
              <div className="pt-8 border-t border-slate-100 flex justify-between text-sm">
                <div className="text-center w-1/2 border-r border-slate-100">
                  <div className="font-black text-slate-900 text-3xl mb-1">1</div>
                  <div className="text-slate-500 font-medium">Upcoming</div>
                </div>
                <div className="text-center w-1/2">
                  <div className="font-black text-slate-900 text-3xl mb-1">{savedDestinations.length}</div>
                  <div className="text-slate-500 font-medium">Saved</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Travel Stats Widget */}
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> Travel Stats
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>World Explored</span>
                  <span>12%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '12%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">12 / 195 Countries</p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Miles Flown</span>
                  <span>45,200</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    className="h-full bg-purple-600 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">Gold Tier Status</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants}>
            <Magnetic intensity={0.1}>
              <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Main Dashboard Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 space-y-12"
        >
          
          {/* Upcoming Journey - Cinematic Card */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <PlaneTakeoff className="w-6 h-6 text-blue-600" /> Upcoming Journey
            </h3>
            
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[450px] group border border-white/20">
              {/* Parallax Image */}
              <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none">
                <motion.img 
                  style={{ y: parallaxY }}
                  src={upcomingTrip.image} 
                  alt={upcomingTrip.title} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
              </div>
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-bold text-sm mb-4 w-max">
                  <MapPin className="w-4 h-4" /> {upcomingTrip.country}
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">{upcomingTrip.title}</h4>
                <p className="text-blue-100 mb-8 font-medium max-w-lg text-lg">Your premium itinerary is finalized. Departure in 14 days.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Magnetic intensity={0.3}>
                    <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-xl">
                      View Itinerary
                    </button>
                  </Magnetic>
                  <Magnetic intensity={0.2}>
                    <button className="bg-slate-900/50 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 hover:bg-slate-900/70 transition-colors">
                      Manage Booking
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Saved Destinations */}
          <motion.section variants={itemVariants}>
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" /> Saved For Later
            </h3>
            
            {savedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedDestinations.map(dest => (
                  <Magnetic key={dest.id} intensity={0.05}>
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.08)] transition-all group cursor-pointer h-full flex flex-col">
                      <div className="h-56 overflow-hidden relative shrink-0">
                        <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-slate-900 text-xl mb-2">{dest.title}</h4>
                          <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                            {dest.description}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-blue-600 font-bold text-sm">
                          Explore Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Magnetic>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 border-dashed">
                <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">No saved destinations yet</h4>
                <p className="text-slate-500 mb-6">Explore the globe and save your favorite places to plan future trips.</p>
                <Magnetic intensity={0.2}>
                  <button onClick={onBrowseExplore} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                    Explore Destinations
                  </button>
                </Magnetic>
              </div>
            )}
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
};
