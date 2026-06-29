import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Heart, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useUI();
  const location = useLocation();

  const isDark = location.pathname === '/' || location.pathname === '/explore';

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 transition-colors duration-300 ${isDark ? 'bg-transparent text-white' : 'bg-white/80 backdrop-blur-md text-slate-900 border-b border-slate-200'}`}>
      
      <Link to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
        <img src="/images/logo.png?v=3" alt="Velora" className="w-8 h-8 rounded object-contain" />
        <span className="font-bold text-2xl tracking-tight">Velora</span>
      </Link>

      <div className="flex items-center gap-4">
        <Button 
          variant={isDark ? 'secondary' : 'outline'} 
          size="sm" 
          leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
          onClick={() => openModal('aiPlanner')}
        >
          AI Planner
        </Button>

        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button variant={isDark ? 'primary' : 'primary'} size="sm" leftIcon={<Heart className="w-4 h-4" />}>
              Saved Trips
            </Button>
          </Link>
        ) : (
          <Button 
            variant={isDark ? 'primary' : 'primary'} 
            size="sm" 
            leftIcon={<User className="w-4 h-4" />}
            onClick={() => openModal('auth')}
          >
            Sign In
          </Button>
        )}

        <button 
          onClick={() => openModal('settings')}
          className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
