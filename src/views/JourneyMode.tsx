import React, { useEffect, useState, useMemo } from 'react';
import { Phone, Shield, ArrowLeft, MapPin, Car, RefreshCw } from 'lucide-react';
import { seedDestinations } from '../data/dbSeed';
import type { SeedDestination } from '../data/dbSeed';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

import { LeafletMapViewer } from '../components/map/LeafletMapViewer';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './JourneyMode.css';

gsap.registerPlugin(ScrollTrigger);



interface JourneyModeProps {
  destination?: SeedDestination;
  onBack?: () => void;
  initialRouteType?: 'scenic' | 'spiritual';
}

export const JourneyMode: React.FC<JourneyModeProps> = ({ destination, onBack, initialRouteType = 'scenic' }) => {
  const dest = destination || seedDestinations[0];
  
  const hasSpiritualTrail = !!dest.spiritualTrails && dest.spiritualTrails.length > 0;

  const [routeType, setRouteType] = useState<'scenic' | 'spiritual'>(initialRouteType);
  const [activeStopIdx, setActiveStopIdx] = useState(0);
  const [mapAnimated, setMapAnimated] = useState(false);

  // Sync initialRouteType when it updates from parent
  useEffect(() => {
    if (initialRouteType) {
      setRouteType(initialRouteType);
    }
  }, [initialRouteType]);

  // Resolve active stops and gems depending on routeType
  const activeStops = useMemo(() => {
    return (routeType === 'spiritual' && hasSpiritualTrail && dest.spiritualTrails)
      ? dest.spiritualTrails[0].stops || []
      : dest.stops || [];
  }, [dest, routeType, hasSpiritualTrail]);

  const activeHiddenGems = useMemo(() => {
    return (routeType === 'spiritual' && hasSpiritualTrail && dest.spiritualTrails)
      ? dest.spiritualTrails[0].hiddenGems || []
      : dest.hiddenGems || [];
  }, [dest, routeType, hasSpiritualTrail]);

  // Dynamically calculate route distance from stops
  const distanceTarget = useMemo(() => {
    return activeStops.reduce((acc, stop) => {
      const num = parseInt(stop.distance.replace(/[^0-9]/g, '')) || 0;
      return acc + num;
    }, 0);
  }, [activeStops]);

  // Dynamically calculate driving duration based on local speed/terrain index
  const durationTarget = useMemo(() => {
    const hours = Math.floor(distanceTarget / 40); // Avg 40km/h in hills
    const mins = Math.floor((distanceTarget % 40) * 1.5);
    return hours * 60 + mins; 
  }, [distanceTarget]);

  const animatedDistance = useAnimatedCounter(distanceTarget, 2500, mapAnimated);
  const animatedDuration = useAnimatedCounter(durationTarget, 2500, mapAnimated);

  const activeStop = activeStops[activeStopIdx % Math.max(1, activeStops.length)];
  const activeGem = activeHiddenGems.length > 0 ? activeHiddenGems[activeStopIdx % activeHiddenGems.length] : null;

  const triggerAnimation = () => {
    setMapAnimated(false);
    setTimeout(() => {
      setMapAnimated(true);
    }, 100);
  };

  // Trigger animation when routeType or destination changes
  useEffect(() => {
    setActiveStopIdx(0);
    triggerAnimation();
  }, [dest, routeType]);

  // Ride Booking Prefill handler
  const handleBookCab = (stopName: string, lat: number, lng: number) => {
    const uberUrl = `https://m.uber.com/ul/?action=setPickup&client_id=velora_travel&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(stopName)}`;
    window.open(uberUrl, '_blank');
  };

  if (!activeStops || activeStops.length === 0) return null;

  return (
    <div className="journey-view view-enter pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6 mb-8">
        <div>
          {onBack && (
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-heading font-semibold text-white mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Explore
            </button>
          )}
          <h1 className="text-3xl font-heading font-extrabold text-white">Journey Mode</h1>
          <p className="text-xs text-muted mt-1">
            Telemetry dashboard for {dest.title} winding route.
          </p>
        </div>

        {/* Route Selector Toggle */}
        {hasSpiritualTrail && (
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm self-start md:self-center">
            <button
              onClick={() => setRouteType('scenic')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                routeType === 'scenic'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'text-muted hover:text-white'
              }`}
            >
              Scenic Expedition
            </button>
            <button
              onClick={() => setRouteType('spiritual')}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                routeType === 'spiritual'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'text-muted hover:text-white'
              }`}
            >
              Spiritual & Heritage Trail
            </button>
          </div>
        )}

        <button 
          onClick={triggerAnimation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-heading font-semibold text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-secondary" />
          Re-center Map
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Interactive Leaflet Map (Lg-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="journey-canvas-container relative min-h-[450px] rounded-3xl border border-white/5 bg-[#060B16] overflow-hidden" data-lenis-prevent="true">
            <LeafletMapViewer 
              lat={activeStops[0]?.lat || 0} 
              lng={activeStops[0]?.lng || 0} 
              zoom={10}
              markers={activeStops.map(s => ({
                lat: s.lat,
                lng: s.lng,
                title: s.name,
                type: routeType
              }))}
              directions={
                activeStops.length > 1 ? {
                  origin: { lat: activeStops[0].lat, lng: activeStops[0].lng },
                  destination: { lat: activeStops[activeStops.length-1].lat, lng: activeStops[activeStops.length-1].lng },
                  waypoints: activeStops.slice(1, -1).map(s => ({
                    location: { lat: s.lat, lng: s.lng },
                    stopover: true
                  }))
                } : undefined
              }
            />
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card glass-panel text-center py-4">
              <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mb-1">Route Distance</span>
              <div className="font-heading font-black text-2xl text-white">{animatedDistance} <span className="text-sm text-white/50">km</span></div>
            </div>
            <div className="stat-card glass-panel text-center py-4">
              <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mb-1">Drive Duration</span>
              <div className="font-heading font-black text-2xl text-white">
                {Math.floor(animatedDuration / 60)}<span className="text-sm text-white/50">h</span> {animatedDuration % 60}<span className="text-sm text-white/50">m</span>
              </div>
            </div>
            <div className="stat-card glass-panel text-center py-4 relative overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mb-1">Scenic Score</span>
              <div className="font-heading font-black text-2xl text-secondary relative z-10">
                {Math.min(99, 85 + Math.floor(activeStopIdx * 2.5))}%
              </div>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Side Panel (Lg-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-5 sticky top-28 border border-white/5 bg-black/20 backdrop-blur-md">
            
            {activeStop && (
              <div>
                {/* Real location waypoint scenery photo card */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-5 border border-white/10 bg-black/40">
                  <img 
                    src={activeStop.image} 
                    alt={activeStop.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B16] via-transparent to-transparent opacity-75" />
                  <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-wider text-secondary font-bold px-2 py-0.5 bg-black/50 border border-white/10 rounded-md backdrop-blur-sm">
                    Waypoint {activeStopIdx + 1} Visual
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-secondary font-bold">Active Stop</span>
                    <h3 className="font-heading font-bold text-white text-lg">{activeStop.name}</h3>
                  </div>
                  <span className="text-xs text-primary font-semibold">{activeStop.time}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-5">{activeStop.desc}</p>
                
                {/* Cab Prefill button */}
                <button
                  onClick={() => handleBookCab(activeStop.name, activeStop.lat, activeStop.lng)}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/45 hover:bg-primary/5 text-xs font-heading font-semibold uppercase text-white transition-all transform active:scale-98 cursor-pointer"
                >
                  <Car className="w-4 h-4 text-primary" />
                  Book Ride via Uber
                </button>
              </div>
            )}

            {/* Secret Gem recommendation at this stop */}
            {activeGem && (
              <div className="mt-6 border-t border-white/5 pt-6 flex gap-4 items-start">
                <img 
                  src={activeGem.image} 
                  alt={activeGem.name} 
                  className="w-16 h-16 rounded-xl object-cover border border-white/15 flex-shrink-0 bg-black/30" 
                />
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1 mb-1">
                    <MapPin className="w-2.5 h-2.5" /> Secret Gem Nearby
                  </span>
                  <h4 className="font-heading font-bold text-white text-sm">{activeGem.name}</h4>
                  <p className="text-[10px] text-muted leading-relaxed mt-1 mb-2">{activeGem.desc}</p>
                  <div className="flex gap-3 text-[9px] text-white/40">
                    <span>Photo: {activeGem.photoScore}%</span>
                    <span>Best: {activeGem.bestTime}</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Emergency Safety Panel */}
          {dest.emergencyContacts && (
            <div className="glass-panel rounded-2xl p-4 border border-red-500/10 bg-red-500/5 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold">Local Safety Contacts</span>
              </div>
              <div className="space-y-2">
                <a href={`tel:${dest.emergencyContacts.hospitalPhone}`} className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group cursor-pointer">
                  <div>
                    <div className="text-xs text-white font-medium">{dest.emergencyContacts.hospitalName}</div>
                    <div className="text-[10px] text-muted mt-0.5">{dest.emergencyContacts.hospitalDistance} away</div>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-white/40 group-hover:text-red-400" />
                </a>
                <a href={`tel:${dest.emergencyContacts.policePhone}`} className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group cursor-pointer">
                  <div>
                    <div className="text-xs text-white font-medium">{dest.emergencyContacts.policeName}</div>
                    <div className="text-[10px] text-muted mt-0.5">Emergency Assistance</div>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-white/40 group-hover:text-red-400" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
