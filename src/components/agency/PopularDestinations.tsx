import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

interface PopularDestinationsProps {
  onSelect?: (dest: any) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onSelect }) => {
  const destinations = [
    {
      id: 1,
      city: "Kashmir",
      country: "India",
      image: "/images/kashmir.png",
      rating: 4.9,
      price: "₹12,000"
    },
    {
      id: 2,
      city: "Kerala",
      country: "India",
      image: "/images/kerala.png",
      rating: 4.8,
      price: "₹15,500"
    },
    {
      id: 3,
      city: "Rajasthan",
      country: "India",
      image: "/images/rajasthan.png",
      rating: 4.9,
      price: "₹18,000"
    },
    {
      id: 4,
      city: "Hampi",
      country: "India",
      image: "/images/hampi.png",
      rating: 4.7,
      price: "₹8,500"
    }
  ];

  return (
    <section className="w-full py-24 bg-slate-50 overflow-hidden perspective-1000">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Popular Destinations</h2>
            <p className="text-slate-600 text-lg">Most visited places by our travelers.</p>
          </motion.div>
          <button className="hidden md:block text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div 
              key={dest.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1000 }}
            >
              <Tilt 
                tiltMaxAngleX={10} 
                tiltMaxAngleY={10} 
                scale={1.02} 
                transitionSpeed={2000}
                className="h-full"
              >
                <div 
                  onClick={() => onSelect && onSelect(dest)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 group cursor-pointer border border-slate-100 h-full flex flex-col"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative h-64 overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
                    <img 
                      src={dest.image} 
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm" style={{ transform: 'translateZ(30px)' }}>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col bg-white" style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex items-center gap-1 text-slate-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{dest.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{dest.city}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-semibold">Starting from</span>
                        <span className="text-lg font-bold text-blue-600">{dest.price}</span>
                      </div>
                      <button className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
