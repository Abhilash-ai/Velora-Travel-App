import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import type { SeedDestination } from '../../data/dbSeed';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: SeedDestination[];
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const subtotal = cartItems.reduce((acc, item) => {
    // Basic parse of price string (e.g. "$1,200" -> 1200)
    const num = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#030303] border-l border-white/10 z-[2010] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-heading text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Itinerary ({cartItems.length})
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 text-center gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your itinerary is currently empty.</p>
                  <button 
                    onClick={onClose}
                    className="text-white underline underline-offset-4 mt-2"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-20 h-24 object-cover bg-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-heading text-sm truncate">{item.title}</h3>
                      <p className="text-white/50 text-xs mt-1">{item.country}</p>
                      <p className="text-white font-medium mt-2">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#060606]">
                <div className="flex justify-between items-center mb-6 text-white">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-xl font-heading">${subtotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-4 bg-white text-black font-medium tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

