import React, { useState } from 'react';
import type { SeedDestination } from '../data/dbSeed';
import { Sparkles, Navigation2, Map as MapIcon, X, Star, Calendar, MapPin, Coffee, Bed, Plus } from 'lucide-react';
import { useCursor } from '../context/CursorContext';

interface DestinationPanelProps {
  destination: SeedDestination;
  onClose: () => void;
  onStartJourney: (dest: SeedDestination) => void;
}

export const DestinationPanel: React.FC<DestinationPanelProps> = ({ destination, onClose, onStartJourney }) => {
  const { setVariant, setText } = useCursor();
  const [showServices, setShowServices] = useState(false);

  // Mock nearby services since Google Places API requires an active key
  const nearbyServices = [
    { type: 'Hotel', name: 'Grand Mountain Resort', distance: '1.2 km', rating: 4.8 },
    { type: 'Cafe', name: 'Cloud 9 Roasters', distance: '0.5 km', rating: 4.6 },
    { type: 'Hospital', name: 'City General Care', distance: '3.0 km', rating: 4.2 }
  ];

  return (
    <div className={`absolute right-8 top-1/2 -translate-y-1/2 bg-[#060b16]/60 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in-right transition-all duration-500 ease-out flex flex-col ${showServices ? 'w-96 h-[80vh]' : 'w-96 h-auto'}`}>
      
      <div className="flex-shrink-0">
        {/* Hero Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b16] via-[#060b16]/40 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/60 transition"
            onMouseEnter={() => { setVariant('hover'); setText(''); }}
            onMouseLeave={() => setVariant('default')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
        <div className="flex items-center gap-2 text-pink-400 mb-2">
          <MapPin className="w-3 h-3" />
          <span className="text-xs font-heading font-bold uppercase tracking-widest">{destination.country}</span>
        </div>
        
        <h2 className="text-3xl font-heading font-bold text-white mb-3">{destination.title}</h2>
        <p className="text-white/70 text-sm leading-relaxed mb-6">
          {destination.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
            <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Beauty</div>
            <div className="text-lg font-heading font-bold">{destination.rating || 4.8}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
            <Sparkles className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Gems</div>
            <div className="text-lg font-heading font-bold">{destination.hiddenGems?.length || 0}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
            <Calendar className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Season</div>
            <div className="text-sm font-heading font-bold mt-1.5">{destination.bestTime || 'Oct - Mar'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            onMouseEnter={() => { setVariant('hover'); setText(''); }}
            onMouseLeave={() => setVariant('default')}
          >
            <Sparkles className="w-4 h-4" />
            Create AI Plan
          </button>
          
          <button 
            onClick={() => onStartJourney(destination)}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-heading font-bold text-sm text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            onMouseEnter={() => { setVariant('journey'); setText('Start'); }}
            onMouseLeave={() => setVariant('default')}
          >
            <Navigation2 className="w-4 h-4" />
            Start Journey
          </button>
        </div>

        {/* Nearby Services Toggle */}
        <div className="border-t border-white/10 pt-4">
          <button 
            className="flex items-center justify-between w-full text-left group"
            onClick={() => setShowServices(!showServices)}
          >
            <span className="font-heading font-bold text-sm text-white/90 group-hover:text-white transition">Nearby Services & Info</span>
            <Plus className={`w-4 h-4 text-white/60 transition-transform duration-300 ${showServices ? 'rotate-45' : ''}`} />
          </button>

          {showServices && (
            <div className="mt-4 space-y-3 animate-fade-in-up">
              <button 
                className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl font-heading font-bold text-xs text-white/80 hover:text-white flex items-center justify-center gap-2 transition-all mb-4"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`, '_blank')}
              >
                <MapIcon className="w-4 h-4" />
                View Google Maps
              </button>

              {nearbyServices.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      {service.type === 'Hotel' ? <Bed className="w-4 h-4 text-pink-400" /> : <Coffee className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">{service.name}</div>
                      <div className="text-[10px] text-white/50">{service.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white/80 flex items-center justify-end gap-1 mb-0.5">
                      <Star className="w-3 h-3 text-amber-400" />
                      {service.rating}
                    </div>
                    <div className="text-[10px] text-white/50">{service.distance}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

