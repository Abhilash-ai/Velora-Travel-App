import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, MapPin, Star, Calendar, Users,
  Plane, Camera, Shield, ChevronRight,
  CloudSun, ExternalLink, Map as MapIcon, Heart
} from 'lucide-react';
import { useTravel } from '../../v2/context/TravelContext';
import { fetchWeatherForDestination, type WeatherData } from '../../services/weatherService';
import { DestinationReviews } from '../../v2/components/agency/DestinationReviews';

interface DestinationDetailsProps {
  destination: any;
  onClose: () => void;
  onBook: () => void;
}

export const DestinationDetails: React.FC<DestinationDetailsProps> = ({ destination, onClose, onBook }) => {
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('2');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const { isDestinationSaved, toggleSaveDestination } = useTravel();
  const isSaved = destination?.id ? isDestinationSaved(destination.id) : false;

  React.useEffect(() => {
    if (destination?.id) {
      fetchWeatherForDestination(destination.id).then(setWeather);
    }
  }, [destination]);

  const destName = destination?.title || 'Unknown Destination';
  const destCountry = destination?.country || 'Unknown';
  
  const rawPriceStr = String(destination?.price || '1200');
  const numericPrice = parseInt(rawPriceStr.replace(/[^0-9]/g, '')) || 1200;
  // Convert to INR if it was in USD, otherwise keep as is
  const price = rawPriceStr.includes('$') ? numericPrice * 83 : numericPrice;

  const rating = destination?.rating || 4.8;
  const mainImage = destination?.image || "/images/andaman.png";
  const description = destination?.description || `Experience the breathtaking beauty and rich culture of ${destName}.`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      {/* Navigation Bar inside Modal */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 transition-colors duration-300">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{destName}, {destCountry}</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => destination?.id && toggleSaveDestination(destination.id)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full transition-colors"
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="pt-24 pb-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Hero Gallery */}
          <div className="grid grid-cols-2 gap-4 h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
            <div className="col-span-2 h-[200px] md:h-full md:col-span-1">
              <img src={mainImage} alt={destName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="hidden md:grid col-span-2 md:col-span-1 grid-rows-2 gap-4 h-full">
              {destination?.galleryImages?.[0] ? (
                <img src={destination.galleryImages[0]} alt={`${destName} view 1`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                   <Camera className="w-8 h-8 text-slate-300" />
                </div>
              )}
              {destination?.galleryImages?.[1] ? (
                <img src={destination.galleryImages[1]} alt={`${destName} view 2`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                   <Camera className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {/* Title, Description & Weather */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-lg">{destCountry}</span>
              </div>
              {weather && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-100 dark:border-blue-800/50 shadow-sm">
                  <CloudSun className="w-4 h-4" />
                  {weather.temp}°C, {weather.condition}
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">{destName} Getaway</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {description}
            </p>
            
            {/* Quick Action Links for Transport/Booking */}
            <div className="flex flex-wrap gap-3">
              <a 
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Hotels on Booking.com
              </a>
              <a 
                href={`https://www.oyorooms.com/search?location=${encodeURIComponent(destName)}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                OYO Rooms
              </a>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Round-trip Flights</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Premium economy seating included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">4-Star Accommodation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">City center hotel with breakfast</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Guided Tours</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">3 exclusive local experiences</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Travel Insurance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive coverage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sample Itinerary</h3>
            <div className="space-y-6 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
              <div className="relative pl-8">
                <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1 border-4 border-white dark:border-slate-900" />
                <h4 className="font-bold text-slate-900 dark:text-white">Day 1: Arrival & Welcome</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Airport transfer, hotel check-in, and welcome dinner featuring local cuisine.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full -left-[9px] top-1 border-4 border-white dark:border-slate-900" />
                <h4 className="font-bold text-slate-900 dark:text-white">Day 2: City Highlights</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Guided walking tour of the historic center, visit to major landmarks, and free afternoon.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full -left-[9px] top-1 border-4 border-white dark:border-slate-900" />
                <h4 className="font-bold text-slate-900 dark:text-white">Day 3: Nature & Adventure</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Day trip to the surrounding natural wonders, including a scenic hike and picnic.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full -left-[9px] top-1 border-4 border-white dark:border-slate-900" />
                <h4 className="font-bold text-slate-900 dark:text-white">Day 4: Leisure & Departure</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Morning at leisure for shopping or relaxation before your private airport transfer.</p>
              </div>
            </div>
          </div>

          {/* Localized Map */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-blue-600" />
              Destination Map
            </h3>
            <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                referrerPolicy="no-referrer-when-downgrade" 
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'MOCK_KEY'}&q=${encodeURIComponent(destName + ', ' + destCountry)}&zoom=10`}
                allowFullScreen
              >
              </iframe>
              {/* Fallback overlay if API key is missing, iframe will just show an error inside it natively which we let pass for now, or we could conditionally render */}
            </div>
          </div>
          
          {/* Traveler Reviews Section */}
          <DestinationReviews destinationId={destination.id} />
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹{price.toLocaleString()}</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium"> / person</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {rating}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Dates</label>
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <input 
                    type="text" 
                    placeholder="Select dates" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="outline-none bg-transparent w-full dark:placeholder-slate-500" 
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Guests</label>
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <input 
                    type="number" 
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="outline-none bg-transparent w-full" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>₹{price.toLocaleString()} x {guests} guests</span>
                <span>₹{(price * Number(guests)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxes & Fees</span>
                <span>₹{Math.round(price * Number(guests) * 0.1).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>Total</span>
                <span>₹{((price * Number(guests)) + Math.round(price * Number(guests) * 0.1)).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={onBook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              Reserve Now
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">You won't be charged yet</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
