import React, { useState } from 'react';
import { X, Mail, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserProfile } from '../../firebase/services';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    // Simulate authentication for the prototype
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        uid: 'demo-user-123',
        phoneNumber: email,
        name: email.split('@')[0],
        preferences: {},
        savedTrips: []
      } as any);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden border border-slate-200"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900">Velora</h2>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Secure Access</span>
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          {isLogin 
            ? 'Sign in to access your saved trips and personalized itineraries.' 
            : 'Join Velora to start planning your dream vacations with AI.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                className="w-full p-4 pl-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-4 pl-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
          
          <div className="flex justify-center mt-2">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
