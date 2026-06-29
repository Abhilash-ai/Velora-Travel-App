import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTravel } from '../context/TravelContext';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../components/dashboard/ProfileSidebar';
import { UpcomingJourney } from '../components/dashboard/UpcomingJourney';
import { SavedTripsGrid } from '../components/dashboard/SavedTripsGrid';
import { dbService } from '../../firebase/services';
import type { SeedDestination } from '../../data/dbSeed';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
} as const;

export const DashboardView: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { savedDestinationIds } = useTravel();
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState<SeedDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDests = async () => {
      const list = await dbService.getDestinations();
      setDestinations(list);
      setIsLoading(false);
    };
    fetchDests();
  }, []);

  if (!isAuthenticated && !user) {
    return (
      <MainLayout>
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Please sign in</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">You must be signed in to view your dashboard.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
            Return Home
          </button>
        </div>
      </MainLayout>
    );
  }

  const savedDestinations = destinations.filter(d => savedDestinationIds.includes(d.id));
  const upcomingTrip = savedDestinations.length > 0 ? savedDestinations[0] : null;

  return (
    <MainLayout>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden transition-colors duration-300">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-4"
          >
            <ProfileSidebar savedCount={savedDestinations.length} />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-12"
          >
            {!isLoading && upcomingTrip && (
              <UpcomingJourney destination={upcomingTrip} />
            )}
            
            {!isLoading && (
              <SavedTripsGrid 
                destinations={savedDestinations} 
                onBrowseExplore={() => navigate('/explore')} 
              />
            )}
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
};


