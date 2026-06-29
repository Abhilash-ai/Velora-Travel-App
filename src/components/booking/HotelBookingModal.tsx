import React, { useState } from 'react';
import { X, CreditCard, Calendar, Users, Home, CheckCircle, ShieldCheck } from 'lucide-react';
import type { SeedDestination } from '../../data/dbSeed';

interface HotelBookingModalProps {
  destination: SeedDestination;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ destination, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [hotelTier, setHotelTier] = useState<'luxury' | 'boutique'>('luxury');
  
  // Fake Credit Card
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = parseInt(destination.price?.replace(/[^0-9]/g, '') || '800');
  const hotelMultiplier = hotelTier === 'luxury' ? 1.5 : 1.0;
  const total = Math.floor(basePrice * parseInt(travelers) * hotelMultiplier);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) return;
    
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      onSuccess({
        destinationId: destination.id,
        title: destination.title,
        dates,
        travelers,
        hotelTier,
        total,
        sandboxId: `TXN-SANDBOX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto view-enter">
      <div className="relative w-full max-w-2xl bg-[#0a101f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white">Book Your Escape</h2>
            <p className="text-xs text-muted">{destination.title}, {destination.country}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Step 1: Configuration */}
          {step === 1 && (
            <div className="space-y-6 view-enter">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Travel Dates
                  </label>
                  <input 
                    type="date" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Travelers
                  </label>
                  <select 
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors appearance-none"
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#0a101f]">{n} {n === 1 ? 'Person' : 'People'}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-[10px] uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" /> Accommodation Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setHotelTier('luxury')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${hotelTier === 'luxury' ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-heading font-bold text-white text-sm">Luxury Resort</span>
                      <span className="text-xs text-primary font-bold">+50%</span>
                    </div>
                    <p className="text-[10px] text-muted">5-star amenities, spa access, premium views.</p>
                  </div>
                  <div 
                    onClick={() => setHotelTier('boutique')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${hotelTier === 'boutique' ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-heading font-bold text-white text-sm">Boutique Stay</span>
                      <span className="text-xs text-primary font-bold">Standard</span>
                    </div>
                    <p className="text-[10px] text-muted">Authentic local charm, highly rated cozy rooms.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-8">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Total Package</p>
                  <p className="text-3xl font-heading font-black text-white">${total}</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!dates}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <form onSubmit={handlePay} className="space-y-6 view-enter">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-primary/90 leading-relaxed">
                  You are entering a secure Sandbox Payment environment. No real funds will be deducted. Please use dummy data.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-semibold">Name on Card</label>
                  <input 
                    type="text" required
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-semibold">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input 
                      type="text" required
                      maxLength={19}
                      value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="0000 0000 0000 0000"
                      className="w-full p-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted font-semibold">Expiry</label>
                    <input 
                      type="text" required placeholder="MM/YY" maxLength={5}
                      value={expiry} onChange={e => setExpiry(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted font-semibold">CVV</label>
                    <input 
                      type="text" required placeholder="123" maxLength={4}
                      value={cvv} onChange={e => setCvv(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-8">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-muted hover:text-white font-semibold transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing...</>
                  ) : `Pay $${total}`}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center text-center view-enter">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-heading font-black text-white mb-2">Booking Confirmed!</h2>
              <p className="text-muted mb-8 max-w-sm mx-auto">
                Pack your bags! You are headed to {destination.title}. Your itinerary and hotel confirmation have been securely saved to your Passport.
              </p>
              
              <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 text-left mb-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                  <span className="text-xs text-muted uppercase tracking-wider">Sandbox Transaction ID</span>
                  <span className="text-xs font-mono text-secondary font-bold bg-secondary/10 px-2 py-1 rounded">
                    TXN-SANDBOX-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted uppercase tracking-wider">Total Paid</span>
                  <span className="text-lg font-heading font-bold text-white">${total}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
