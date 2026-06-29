import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, Shield, HeartPulse, X, MapPin } from 'lucide-react';

interface EmergencyHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHub: React.FC<EmergencyHubProps> = ({ isOpen, onClose }) => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', icon: <AlertCircle className="w-5 h-5" /> },
    { name: 'Police', number: '100', icon: <Shield className="w-5 h-5" /> },
    { name: 'Fire', number: '101', icon: <AlertCircle className="w-5 h-5" /> },
    { name: 'Ambulance', number: '102', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Women Helpline', number: '1091', icon: <Shield className="w-5 h-5" /> },
    { name: 'Tourist Helpline', number: '1363', icon: <Phone className="w-5 h-5" /> }
  ];

  useEffect(() => {
    if (isOpen) {
      locateUser();
    }
  }, [isOpen]);

  const locateUser = () => {
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          fetchNearbyServices(loc);
        },
        (err) => {
          console.error(err);
          setError("Location access denied or unavailable.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const fetchNearbyServices = async (location: {lat: number, lng: number}) => {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node(around:5000,${location.lat},${location.lng})["amenity"~"hospital|clinic|doctors"];
          way(around:5000,${location.lat},${location.lng})["amenity"~"hospital|clinic|doctors"];
        );
        out center 3;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      if (!response.ok) {
        throw new Error("Overpass API error");
      }

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const formattedPlaces = data.elements
          .filter((e: any) => e.tags && e.tags.name)
          .map((e: any) => ({
            id: e.id,
            name: e.tags.name,
            lat: e.lat || e.center?.lat,
            lng: e.lon || e.center?.lon,
            type: e.tags.amenity
          }));
        setNearbyPlaces(formattedPlaces.slice(0, 3));
      } else {
        setNearbyPlaces([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load nearby hospitals from OpenStreetMap.");
    } finally {
      setLoading(false);
    }
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-red-500/30 rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Emergency Hub</h2>
                    <p className="text-sm text-slate-400">Immediate assistance & nearby services</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Speed Dial Grid */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Dial (India)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {emergencyNumbers.map((em, idx) => (
                    <a 
                      key={idx}
                      href={`tel:${em.number}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
                    >
                      <div className="text-red-400 group-hover:text-red-500">{em.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{em.name}</div>
                        <div className="text-lg font-bold text-red-400">{em.number}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Nearby Services */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Nearest Hospitals</h3>
                  {userLocation && <span className="text-xs text-green-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location Active</span>}
                </div>

                {loading ? (
                  <div className="p-8 text-center text-slate-400 animate-pulse">Locating nearest emergency services...</div>
                ) : error ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                ) : nearbyPlaces.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {nearbyPlaces.map((place, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <h4 className="font-bold text-white">{place.name}</h4>
                          <p className="text-xs text-slate-400 mt-1 capitalize">{place.type}</p>
                        </div>
                        <a 
                          href={`https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLocation?.lat},${userLocation?.lng};${place.lat},${place.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors"
                        >
                          Navigate
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm text-center">
                    No hospitals found nearby or location services disabled.
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
