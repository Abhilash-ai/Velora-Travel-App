import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Train, Bus, X, ExternalLink, MapPin, Search } from 'lucide-react';

interface TransportHubProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName?: string;
  destinationLat?: number;
  destinationLng?: number;
}

export const TransportHub: React.FC<TransportHubProps> = ({ 
  isOpen, 
  onClose, 
  destinationName = 'Your Destination',
  destinationLat,
  destinationLng
}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'cabs' | 'trains' | 'buses'>('cabs');
  const [flightOrigin, setFlightOrigin] = useState('DEL');
  const [flightDest, setFlightDest] = useState('BOM');

  const tabs = [
    { id: 'cabs', label: 'Cabs', icon: <Car className="w-4 h-4" /> },
    { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { id: 'trains', label: 'Trains', icon: <Train className="w-4 h-4" /> },
    { id: 'buses', label: 'Buses', icon: <Bus className="w-4 h-4" /> },
  ];

  const handleBookUber = () => {
    // Uber Deep Link with destination pre-filled
    const uberUrl = destinationLat && destinationLng 
      ? `https://m.uber.com/ul/?action=setPickup&client_id=velora_travel&dropoff[latitude]=${destinationLat}&dropoff[longitude]=${destinationLng}&dropoff[nickname]=${encodeURIComponent(destinationName)}`
      : `https://m.uber.com/ul/?action=setPickup&client_id=velora_travel`;
    window.open(uberUrl, '_blank');
  };

  const handleBookOla = () => {
    // Ola Web Booking fallback (as Ola deep links require specific app intents)
    window.open(`https://book.olacabs.com/?drop_lat=${destinationLat || ''}&drop_lng=${destinationLng || ''}&drop_name=${encodeURIComponent(destinationName)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[10%] bottom-0 left-0 right-0 md:top-[20%] md:left-[15%] md:right-[15%] md:rounded-t-3xl z-50 bg-[#0A0A0A] border-t border-blue-500/30 md:border-x md:border-blue-500/30 overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Transport Hub</h2>
                    <p className="text-sm text-slate-400">Seamless travel to <span className="text-blue-400 font-medium">{destinationName}</span></p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                
                {/* Cabs Content */}
                {activeTab === 'cabs' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
                      <div className="mt-1"><MapPin className="w-5 h-5 text-blue-400" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Destination Pre-filled</h3>
                        <p className="text-xs text-slate-400 mt-1">When you click book, your destination ({destinationName}) will automatically be set in the cab application.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={handleBookUber}
                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-black border border-white/10 hover:border-white/30 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-2xl font-black text-white tracking-tight">Uber</h2>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                          Book Ride <ExternalLink className="w-3 h-3" />
                        </div>
                      </button>

                      <button 
                        onClick={handleBookOla}
                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-[#D6FF00]/5 border border-[#D6FF00]/20 hover:border-[#D6FF00]/50 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D6FF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-2xl font-black text-[#D6FF00] tracking-tight">OLA</h2>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                          Book Ride <ExternalLink className="w-3 h-3" />
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Flights Content */}
                {activeTab === 'flights' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">From</label>
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-blue-500" />
                          <input type="text" value={flightOrigin} onChange={e => setFlightOrigin(e.target.value)} className="bg-transparent border-none outline-none text-white font-bold w-full" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">To</label>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <input type="text" value={flightDest} onChange={e => setFlightDest(e.target.value)} className="bg-transparent border-none outline-none text-white font-bold w-full" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors">
                      <Search className="w-4 h-4" /> Search Live Flights
                    </button>
                    <div className="mt-4 p-6 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                      <Plane className="w-8 h-8 text-slate-600 mb-3" />
                      <p className="text-sm text-slate-400">Flight API integration requires Amadeus credentials.</p>
                      <p className="text-xs text-slate-500 mt-1">Please provide the API key to enable live availability.</p>
                    </div>
                  </motion.div>
                )}

                {/* Trains / Buses (Placeholders for now) */}
                {(activeTab === 'trains' || activeTab === 'buses') && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[250px] p-8 text-center rounded-2xl bg-white/5 border border-white/10">
                    {activeTab === 'trains' ? <Train className="w-12 h-12 text-slate-600 mb-4" /> : <Bus className="w-12 h-12 text-slate-600 mb-4" />}
                    <h3 className="text-lg font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-sm text-slate-400 max-w-md">Live integration with IRCTC and RedBus is currently in development. You will soon be able to book overland travel directly from this hub.</p>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
