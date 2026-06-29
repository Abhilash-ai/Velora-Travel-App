import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { MainLayout } from '../components/layout/MainLayout';
import { CinematicHero } from '../../components/agency/CinematicHero';
import { SunriseBeach } from '../../components/agency/SunriseBeach';
import { HorizontalShowcase } from '../../components/agency/HorizontalShowcase';
import { TransformativeJourneys } from '../../components/agency/TransformativeJourneys';
import { BiomeJourney } from '../../components/agency/BiomeJourney';
import { FeaturedPackages } from '../../components/agency/FeaturedPackages';
import { WhyChooseUs } from '../../components/agency/WhyChooseUs';
import { CTASection } from '../../components/CTASection';
import { DestinationDetails } from '../../components/agency/DestinationDetails';
import { CheckoutView } from '../../components/agency/CheckoutView';
import { JourneyMode } from '../../views/JourneyMode';
import { dbService } from '../../firebase/services';
import type { SeedDestination } from '../../data/dbSeed';
import { seedDestinations } from '../../data/dbSeed';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useUI();
  const [destinations, setDestinations] = useState<SeedDestination[]>([]);
  const [selectedDest, setSelectedDest] = useState<SeedDestination | null>(null);
  const [flowState, setFlowState] = useState<'none' | 'details' | 'checkout' | 'journey'>('none');

  useEffect(() => {
    const fetchDests = async () => {
      const list = await dbService.getDestinations();
      setDestinations(list);
    };
    fetchDests();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout noPadding>
      <CinematicHero 
        onExplore={() => navigate('/explore')}
        onPlan={() => openModal('aiPlanner')}
      />
      <SunriseBeach />
      <div id="discover">
        <HorizontalShowcase 
          onSelectDestination={(id) => {
            let dest = destinations.find(d => d.id === id);
            // Fallback to local data if database fetch hasn't completed or failed
            if (!dest) {
              dest = seedDestinations.find(d => d.id === id);
            }
            if (dest) {
              setSelectedDest(dest);
              setFlowState('details');
            } else {
              console.error("Destination not found:", id);
            }
          }} 
        />
      </div>
      <TransformativeJourneys />
      <BiomeJourney />
      <FeaturedPackages 
        onSelectDestination={(id) => {
          let dest = destinations.find(d => d.id === id);
          if (!dest) {
            dest = seedDestinations.find(d => d.id === id);
          }
          if (dest) {
            setSelectedDest(dest);
            setFlowState('details');
          }
        }}
      />
      <WhyChooseUs />
      <CTASection 
        onStartExploring={() => scrollToSection('discover')} 
        onCreatePlan={() => openModal('aiPlanner')} 
      />

      <AnimatePresence>
        {flowState === 'details' && selectedDest && (
          <motion.div 
            key="details" 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            variants={modalVariants} 
            className="fixed inset-0 z-[1400] bg-white dark:bg-slate-900 overflow-y-auto"
          >
            <DestinationDetails 
              destination={selectedDest}
              onClose={() => setFlowState('none')}
              onBook={() => setFlowState('checkout')}
            />
          </motion.div>
        )}
        
        {flowState === 'checkout' && selectedDest && (
          <motion.div 
            key="checkout" 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            variants={modalVariants} 
            className="fixed inset-0 z-[1450] bg-white overflow-y-auto"
          >
            <CheckoutView 
              destination={selectedDest}
              onClose={() => setFlowState('none')}
              onBack={() => setFlowState('details')}
              onSuccess={() => setFlowState('journey')}
            />
          </motion.div>
        )}

        {flowState === 'journey' && selectedDest && (
          <motion.div 
            key="journey" 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            variants={modalVariants} 
            className="fixed inset-0 z-[1600] bg-[#060B16] overflow-y-auto"
          >
            <JourneyMode 
              destination={selectedDest}
              onBack={() => setFlowState('none')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

