import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, ChevronLeft, Calendar, Users, ShieldCheck } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';

interface CheckoutViewProps {
  destination: any;
  onClose: () => void;
  onBack: () => void;
  onSuccess?: () => void;
}

// Sub-component: The 3D Animated Credit Card
const AnimatedCreditCard = ({ 
  cardNumber, 
  cardName, 
  expiry, 
  cvc, 
  isFlipped 
}: { 
  cardNumber: string; 
  cardName: string; 
  expiry: string; 
  cvc: string; 
  isFlipped: boolean 
}) => {
  // Formatting helper
  const formatCardNumber = (num: string) => {
    const padded = num.padEnd(16, '•');
    return padded.match(/.{1,4}/g)?.join(' ') || '';
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[220px] perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden backface-hidden shadow-2xl border border-white/20"
          style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Decorative Gloss */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-sm"></div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-multiply"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-multiply"></div>
            </div>
          </div>
          
          <div className="relative z-10 text-white space-y-4">
            <div className="font-mono text-2xl tracking-widest drop-shadow-md">
              {formatCardNumber(cardNumber)}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Cardholder Name</p>
                <p className="font-bold tracking-wide truncate max-w-[180px]">
                  {cardName.trim() ? cardName.toUpperCase() : 'JOHN DOE'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Valid Thru</p>
                <p className="font-bold font-mono tracking-wider">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-center overflow-hidden shadow-2xl border border-white/20"
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="w-full h-12 bg-black mb-6"></div>
          <div className="px-6 relative">
            <div className="w-full h-10 bg-slate-200 rounded flex items-center justify-end px-4">
              <span className="font-mono text-slate-800 font-bold">{cvc || '•••'}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-2">Authorized Signature Not Required</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export const CheckoutView: React.FC<CheckoutViewProps> = ({ destination, onClose, onBack, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const destName = destination?.title || 'Unknown Destination';
  
  const rawPriceStr = String(destination?.price || '1200');
  const numericPrice = parseInt(rawPriceStr.replace(/[^0-9]/g, '')) || 1200;
  const price = rawPriceStr.includes('$') ? numericPrice * 83 : numericPrice;
  
  const guests = 2;
  const subtotal = price * guests;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY || 'rzp_test_mock_key',
      amount: total * 100, 
      currency: "INR",
      name: "Velora Travel",
      description: `Booking for ${destName}`,
      image: "https://ui-avatars.com/api/?name=Velora&background=2563eb&color=fff",
      handler: function () {
        setIsProcessing(false);
        setIsSuccess(true);
      },
      prefill: {
        name: cardName || "Guest User",
        email: "guest@velora.com",
        contact: "9999999999"
      },
      theme: {
        color: "#2563eb"
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    
    rzp1.on('payment.failed', function (response: any) {
      alert(`Payment Failed: ${response.error.description}`);
      setIsProcessing(false);
    });

    rzp1.open();
  };

  // Input Handlers for Card Formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(val);
  };

  // Render the cinematic Success Screen
  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[1500] bg-blue-600 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Expanding Ring Animation */}
        <motion.div 
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-64 h-64 border-[40px] border-white rounded-full pointer-events-none"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xl text-center max-w-lg relative z-10"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Booking Confirmed!</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 font-medium">
            Your transformative journey to <strong>{destName}</strong> is officially locked in. We've sent the details to your email.
          </p>
          <Magnetic intensity={0.3}>
            <button 
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                } else {
                  onClose();
                }
              }} 
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors shadow-xl"
            >
              Start Journey
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen w-full relative transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <h2 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Secure Checkout</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Form Area */}
        <div className="lg:col-span-7 relative">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Info Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[50px] -mr-10 -mt-10" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 relative z-10">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-400">First Name</label>
                  <input 
                    type="text" 
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium dark:text-white dark:placeholder-slate-500" 
                    placeholder="John" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium dark:text-white dark:placeholder-slate-500" 
                    placeholder="Doe" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium dark:text-white dark:placeholder-slate-500" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Details Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                Payment Details <ShieldCheck className="w-5 h-5 text-green-600" />
              </h3>

              {/* 3D Interactive Card Visualization */}
              <div className="mb-10">
                <AnimatedCreditCard 
                  cardNumber={cardNumber}
                  cardName={cardName}
                  expiry={expiry}
                  cvc={cvc}
                  isFlipped={isFlipped}
                />
              </div>

              <form onSubmit={handlePay} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setIsFlipped(false)}
                      className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-mono tracking-widest font-bold text-slate-800 dark:text-white dark:placeholder-slate-500" 
                      placeholder="0000 0000 0000 0000" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Expiry Date</label>
                    <input 
                      type="text" 
                      required 
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setIsFlipped(false)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-mono font-bold text-slate-800 dark:text-white dark:placeholder-slate-500 text-center" 
                      placeholder="MM/YY" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-400 flex justify-between">
                      CVC <span className="text-slate-400 font-normal">3 digits</span>
                    </label>
                    <input 
                      type="password" 
                      required 
                      value={cvc}
                      onChange={handleCvcChange}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-mono font-bold text-slate-800 dark:text-white dark:placeholder-slate-500 text-center tracking-widest" 
                      placeholder="•••" 
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <Magnetic intensity={0.2}>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                          Pay ₹{total.toLocaleString()}
                        </>
                      )}
                    </button>
                  </Magnetic>
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Payments are secure and encrypted
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-900 text-white p-8 rounded-3xl sticky top-24 shadow-2xl border border-slate-800"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Order Summary</h3>
            
            <div className="flex gap-4 mb-8">
              <img 
                src={destination?.image || "/images/hampi.png"} 
                alt={destName} 
                className="w-24 h-24 object-cover rounded-xl shadow-md border border-white/10"
              />
              <div>
                <h4 className="font-bold text-lg leading-tight mb-2">{destName} Experience</h4>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1 font-medium">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Next Available Date
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <Users className="w-4 h-4 text-blue-400" />
                  {guests} Guests
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm font-medium border-t border-slate-800 pt-6">
              <div className="flex justify-between text-slate-300">
                <span>{destName} Base Package x {guests}</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Taxes & Fees</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Service Charge</span>
                <span className="text-green-400 font-bold uppercase tracking-wider">Waived</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 mt-6 pt-6">
              <div>
                <span className="block text-sm text-slate-400 font-medium mb-1">Total Amount</span>
                <span className="text-3xl font-black">₹{total.toLocaleString()}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">INR</span>
            </div>
            
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-400 flex gap-3">
              <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
              <p className="leading-relaxed">
                By completing this booking, you agree to our booking terms and conditions. Cancellation is free up to 48 hours before the trip.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
