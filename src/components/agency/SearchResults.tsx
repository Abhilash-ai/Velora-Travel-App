import React, { useState } from 'react';
import { Star, MapPin, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchQuery {
  destination: string;
  dates: string;
  guests: string;
}

interface SearchResultsProps {
  query: SearchQuery;
  onClose: () => void;
  onSelectDestination: (dest: any) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, onClose, onSelectDestination }) => {
  const [priceRange, setPriceRange] = useState<number>(2000);
  
  // Mock results based on query
  const results = [
    {
      id: 101,
      city: query.destination || "Bali",
      country: "Indonesia",
      image: "/images/ladakh.png",
      rating: 4.8,
      price: 850,
      description: "Experience the ultimate tropical paradise with pristine beaches and vibrant culture."
    },
    {
      id: 102,
      city: "Ubud",
      country: "Indonesia",
      image: "/images/goa.png",
      rating: 4.9,
      price: 650,
      description: "Discover the cultural heart of Bali, surrounded by lush rainforests and terraced rice paddies."
    },
    {
      id: 103,
      city: "Nusa Penida",
      country: "Indonesia",
      image: "/images/kerala.png",
      rating: 4.7,
      price: 450,
      description: "Explore rugged coastlines and crystal clear waters perfect for diving."
    }
  ].filter(r => r.price <= priceRange);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-slate-50 pt-24 pb-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Results for "{query.destination || 'Anywhere'}"
            </h2>
            <p className="text-slate-500 mt-2">
              {query.dates || 'Any dates'} • {query.guests || 'Any guests'} • {results.length} properties found
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all"
          >
            <X className="w-4 h-4" /> Clear Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center gap-2 font-bold text-lg border-b border-slate-100 pb-4 mb-4">
              <Filter className="w-5 h-5" /> Filters
            </div>
            
            <div className="mb-6">
              <label className="font-semibold text-slate-900 block mb-2">Max Price per person</label>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-2">
                <span>₹10,000</span>
                <span className="font-bold text-blue-600">₹{priceRange.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="font-semibold text-slate-900 block mb-3">Star Rating</label>
              <div className="flex flex-col gap-2">
                {[5, 4, 3].map(stars => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600" defaultChecked />
                    <span className="flex items-center text-sm text-slate-700">
                      {stars} <Star className="w-3 h-3 ml-1 fill-amber-400 text-amber-400" /> & Up
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
              Apply Filters
            </button>
          </div>

          {/* Results Grid */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((dest, idx) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectDestination(dest)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-200 group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold">{dest.rating}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{dest.country}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{dest.city}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{dest.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold block">From</span>
                      <span className="text-lg font-black text-blue-600">₹{dest.price.toLocaleString()}</span>
                    </div>
                    <button className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-lg text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {results.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                <p className="text-lg">No destinations found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
