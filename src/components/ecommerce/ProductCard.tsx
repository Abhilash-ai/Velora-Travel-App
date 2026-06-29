import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import type { SeedDestination } from '../../data/dbSeed';

interface ProductCardProps {
  destination: SeedDestination;
  onClick: (dest: SeedDestination) => void;
  onBook: (dest: SeedDestination, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ destination, onClick, onBook }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(destination)}
      className="group cursor-pointer flex flex-col gap-5 w-full relative"
    >
      {/* Dynamic Glow behind card */}
      <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 group-hover:border-white/30 transition-colors duration-500 shadow-2xl">
        <motion.img 
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={destination.image} 
          alt={destination.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100"
        />
        
        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold tracking-widest uppercase rounded-full">
            {destination.country}
          </span>
          {destination.photoScore > 90 && (
             <span className="px-3 py-1 bg-white text-black text-[10px] font-semibold tracking-widest uppercase rounded-full">
               Trending
             </span>
          )}
        </div>
        
        {/* Quick Add Button */}
        <div className="absolute bottom-4 inset-x-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
          <button 
            onClick={(e) => onBook(destination, e)}
            className="w-full py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium text-sm tracking-wide uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors rounded-xl overflow-hidden relative group/btn"
          >
            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Book Experience
            </span>
          </button>
        </div>

        {/* Gradient Overlay for text readability if needed */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 px-2 relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-heading font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
            {destination.title}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <span className="text-lg font-sans font-light text-white">{destination.price}</span>
        </div>
        
        <div className="flex items-center gap-3 text-white/50 text-xs tracking-wider">
          <span className="flex items-center gap-1.5 text-white/80">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            {destination.rating} ({destination.reviewsCount || 0})
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>7 Days</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{destination.bestTime}</span>
        </div>
      </div>
    </motion.div>
  );
};

