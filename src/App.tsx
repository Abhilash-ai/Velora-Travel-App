import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Lenis from 'lenis';
import { CursorProvider } from './context/CursorContext';
import { CustomCursor } from './components/CustomCursor';
import { EmergencySOS } from './components/ui/EmergencySOS';
import { Preloader } from './components/ui/Preloader';

// Database & Firebase Service Adaptors
import { authService, dbService } from './firebase/services';
import type { UserProfile } from './firebase/services';
import type { SeedDestination } from './data/dbSeed';

// Landing Page Components
import { CTASection } from './components/CTASection';
import { FooterSection } from './components/FooterSection';
import { CinematicHero } from './components/agency/CinematicHero';
import { SunriseBeach } from './components/agency/SunriseBeach';
import { HorizontalShowcase } from './components/agency/HorizontalShowcase';
import { BiomeJourney } from './components/agency/BiomeJourney';
import { TransformativeJourneys } from './components/agency/TransformativeJourneys';
import { FeaturedPackages } from './components/agency/FeaturedPackages';
import { WhyChooseUs } from './components/agency/WhyChooseUs';
import { SearchResults } from './components/agency/SearchResults';
import { DestinationDetails } from './components/agency/DestinationDetails';
import { Magnetic } from './components/ui/Magnetic';

// 3D Graphics & Overlays
import { R3FGlobe } from './components/R3FGlobe';
import { DestinationPanel } from './components/DestinationPanel';
import { TravelDNAQuiz } from './components/onboarding/TravelDNAQuiz';
import { AuthModal } from './components/auth/AuthModal';

// Functional Views
import { JourneyMode } from './views/JourneyMode';
import { AIPlanner } from './views/AIPlanner';
import { CheckoutView } from './components/agency/CheckoutView';

import { AdminDashboard } from './views/AdminDashboard';
import { SavedView } from './views/SavedView';

import './App.css';

const modalVariants = {
  hidden: { 
    opacity: 0, 
    clipPath: 'circle(0% at 50% 50%)',
    scale: 1.05
  },
  visible: { 
    opacity: 1, 
    clipPath: 'circle(150% at 50% 50%)',
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.76, 0, 0.24, 1] as const 
    } 
  },
  exit: { 
    opacity: 0, 
    clipPath: 'circle(0% at 50% 50%)',
    scale: 0.95,
    transition: { 
      duration: 0.8, 
      ease: [0.76, 0, 0.24, 1] as const 
    } 
  }
};

function App() {
  // Initialize Lenis for Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDNAQuiz, setShowDNAQuiz] = useState(false);

  // Modal views: 'explore' | 'planner' | 'journey' | 'admin' | 'saved' | 'search' | 'details' | 'checkout' | null
  const [activeModal, setActiveModal] = useState<'explore' | 'planner' | 'journey' | 'admin' | 'saved' | 'search' | 'details' | 'checkout' | null>(null);
  const [searchQuery] = useState({ destination: '', dates: '', guests: '' });
  
  // Data states
  const [destinations, setDestinations] = useState<SeedDestination[]>([]);
  const [selectedDest, setSelectedDest] = useState<SeedDestination | null>(null);
  const [activeGlobeDest, setActiveGlobeDest] = useState<SeedDestination | null>(null);
  const [savedIds] = useState<string[]>(['1', '3']); 
  const [plannerPrefill, setPlannerPrefill] = useState('');

  // Fetch destinations and track auth state
  useEffect(() => {
    const fetchDests = async () => {
      const list = await dbService.getDestinations();
      setDestinations(list);
    };
    fetchDests();

    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && !user.travelDNA) {
        setShowDNAQuiz(true);
      } else {
        setShowDNAQuiz(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDestinationSelect = (dest: SeedDestination) => {
    setActiveGlobeDest(dest);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CursorProvider>
      <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
        <CustomCursor />
        <EmergencySOS />

        <AnimatePresence mode="wait">
          {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* Dynamic Header */}
        <header className="fixed top-0 left-0 right-0 h-20 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-md px-6 md:px-12 flex justify-between items-center transition-all">
          <Magnetic intensity={0.2}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveModal(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <img src="/images/logo.png?v=2" alt="Velora Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain" />
              <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">Velora</span>
            </div>
          </Magnetic>
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Magnetic intensity={0.2}><button onClick={() => scrollToSection('discover')} className="hover:text-blue-600 transition-colors">Destinations</button></Magnetic>
              <Magnetic intensity={0.2}><button onClick={() => scrollToSection('packages')} className="hover:text-blue-600 transition-colors">Packages</button></Magnetic>
              <Magnetic intensity={0.2}><button onClick={() => setActiveModal('planner')} className="hover:text-blue-600 transition-colors">AI Planner</button></Magnetic>
            </nav>
            {currentUser ? (
              <Magnetic intensity={0.3}>
                <button onClick={() => setActiveModal('saved')} className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-colors shadow-md">
                  My Dashboard
                </button>
              </Magnetic>
            ) : (
              <Magnetic intensity={0.3}>
                <button onClick={() => setShowAuthModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors shadow-md">
                  Sign In
                </button>
              </Magnetic>
            )}
          </div>
        </header>

        {/* MAIN LANDING PAGE */}
        <AnimatePresence mode="wait">
          {activeModal === null && !isLoading && (
            <motion.main 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full relative"
            >
              <CinematicHero 
                onExplore={() => setActiveModal('explore')}
                onPlan={() => { setActiveModal('planner'); setPlannerPrefill(''); }}
              />
              <SunriseBeach />
              <div id="discover">
                <HorizontalShowcase 
                  onSelectDestination={(id) => {
                    const dest = destinations.find(d => d.id === id);
                    if (dest) {
                      setSelectedDest(dest);
                      setActiveModal('details');
                    }
                  }} 
                />
              </div>
              <TransformativeJourneys />
              <BiomeJourney />
              <FeaturedPackages onSelectDestination={() => {}} />
              <WhyChooseUs />
              <CTASection onStartExploring={() => scrollToSection('discover')} onCreatePlan={() => { setActiveModal('planner'); setPlannerPrefill(''); }} />
              <FooterSection onLinkClick={() => {}} onOpenPlanner={() => setActiveModal('planner')} onOpenJourney={() => setActiveModal('journey')} />
            </motion.main>
          )}

          {/* 3D GLOBE EXPLORE MODE */}
          {activeModal === 'explore' && (
            <motion.div 
              key="explore"
              initial="hidden" animate="visible" exit="exit" variants={modalVariants}
              className="fixed inset-0 z-[1200] bg-[#030303]"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md text-white/70 hover:text-white transition-all text-sm font-medium tracking-wide uppercase"
              >
                <X className="w-4 h-4" /> Back to Earth
              </button>
              
              <div className="absolute inset-0 z-0">
                <R3FGlobe 
                  destinations={destinations} 
                  onDestinationSelect={handleDestinationSelect}
                  selectedDestination={activeGlobeDest}
                />
              </div>

              {/* Floating Pin Preview */}
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
                      onStartJourney={(dest) => { setActiveModal('journey'); setSelectedDest(dest); }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODALS AND OVERLAYS */}
        <AnimatePresence>
          {activeModal === 'search' && (
            <motion.div key="search" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass overflow-y-auto" data-lenis-prevent="true">
              <SearchResults 
                query={searchQuery}
                onClose={() => setActiveModal(null)}
                onSelectDestination={(dest) => {
                  setSelectedDest(dest);
                  setActiveModal('details');
                }}
              />
            </motion.div>
          )}

          {activeModal === 'details' && (
            <motion.div key="details" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass overflow-y-auto" data-lenis-prevent="true">
              <DestinationDetails 
                destination={selectedDest}
                onClose={() => setActiveModal(null)}
                onBook={() => {
                  setActiveModal('checkout'); // For the next phase
                }}
              />
            </motion.div>
          )}

          {activeModal === 'planner' && (
            <motion.div key="planner" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass overflow-y-auto" data-lenis-prevent="true">
              <AIPlanner 
                prefilledDestination={plannerPrefill} 
                onClose={() => setActiveModal(null)}
              />
            </motion.div>
          )}

          {activeModal === 'journey' && (
            <motion.div key="journey" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass" data-lenis-prevent="true">
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors z-50">
                <X className="w-5 h-5" />
              </button>
              <JourneyMode />
            </motion.div>
          )}

          {activeModal === 'checkout' && (
            <motion.div key="checkout" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass overflow-y-auto" data-lenis-prevent="true">
              <CheckoutView 
                destination={selectedDest}
                onBack={() => setActiveModal('details')}
                onClose={() => setActiveModal(null)}
              />
            </motion.div>
          )}

          {activeModal === 'admin' && (
            <motion.div key="admin" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] bg-[#030303] overflow-y-auto" data-lenis-prevent="true">
              <button onClick={() => setActiveModal(null)} className="fixed top-6 right-6 z-[2000] w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all">
                <X className="w-5 h-5" />
              </button>
              <AdminDashboard />
            </motion.div>
          )}

          {activeModal === 'saved' && (
            <motion.div key="saved" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[1400] modal-glass overflow-y-auto" data-lenis-prevent="true">
              <button onClick={() => setActiveModal(null)} className="fixed top-6 right-6 z-[2000] w-12 h-12 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-slate-100 transition-all">
                <X className="w-5 h-5" />
              </button>
              <SavedView 
                user={currentUser}
                savedIds={savedIds} 
                onBrowseExplore={() => setActiveModal(null)}
                onLogout={() => authService.logout()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDNAQuiz && (
            <motion.div key="dna" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <TravelDNAQuiz 
                onComplete={() => setShowDNAQuiz(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuthModal && (
            <motion.div key="auth" initial="hidden" animate="visible" exit="exit" variants={modalVariants} className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <AuthModal 
                onClose={() => setShowAuthModal(false)} 
                onSuccess={() => setShowAuthModal(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CursorProvider>
  );
}

export default App;
