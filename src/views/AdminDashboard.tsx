import React, { useState } from 'react';
import { Shield, Sparkles, Compass, Users, Database, RotateCcw, AlertTriangle, AreaChart, Heart } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

export const AdminDashboard: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'synced' | 'resetting'>('synced');

  // Interactive statistics counters
  const usersCount = useAnimatedCounter(1420, 2000);
  const plansCount = useAnimatedCounter(894, 2000);
  const aiCount = useAnimatedCounter(4205, 2000);
  const routesCount = useAnimatedCounter(12, 2000);

  const handleResetDatabase = () => {
    setDbStatus('resetting');
    setTimeout(() => {
      localStorage.clear();
      localStorage.setItem('velora_seeded', 'true');
      setDbStatus('synced');
    }, 1500);
  };

  const trendingDestinations = [
    { title: 'Kashmir, India', saves: 245, pct: 90 },
    { title: 'Kerala, India', saves: 189, pct: 75 },
    { title: 'Goa, India', saves: 164, pct: 68 },
    { title: 'Ladakh, India', saves: 142, pct: 60 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-28 view-enter">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-heading font-extrabold tracking-widest text-xs uppercase text-white">Velora Administrator</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white">Control Room</h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          System Synced
        </span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <Users className="w-5 h-5 text-muted mb-4" />
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Active Travelers</p>
          <p className="text-3xl font-heading font-extrabold text-white">{usersCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <Compass className="w-5 h-5 text-muted mb-4" />
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Journeys Drawn</p>
          <p className="text-3xl font-heading font-extrabold text-white">{plansCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#06b6d4]" />
          <Sparkles className="w-5 h-5 text-muted mb-4" />
          <p className="text-xs text-muted uppercase tracking-wider mb-1">AI Operations</p>
          <p className="text-3xl font-heading font-extrabold text-white">{aiCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#fbbf24]" />
          <Database className="w-5 h-5 text-muted mb-4" />
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Seeded Targets</p>
          <p className="text-3xl font-heading font-extrabold text-white">{routesCount}</p>
        </div>

      </div>

      {/* Main Charts & Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        
        {/* Left: Interactive SVGA charts */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
              <AreaChart className="w-4 h-4 text-primary" />
              AI Activity Cycles
            </h3>
            <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Weekly Load</span>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="w-full h-[220px] relative overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Mountain Line */}
              <path
                d="M 0 160 Q 70 80, 120 120 T 260 40 T 380 90 T 500 30"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 160 Q 70 80, 120 120 T 260 40 T 380 90 T 500 30 L 500 200 L 0 200 Z"
                fill="url(#chartGrad)"
              />
              
              {/* Secondary Line */}
              <path
                d="M 0 180 Q 80 140, 150 160 T 300 90 T 500 70"
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] text-muted font-heading uppercase tracking-wider">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right: Database Seeding & Resetting controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="font-heading font-bold text-white text-md mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-secondary" />
              System Config
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Resets local storage cache variables and restores default seeded destinations coordinates.
            </p>
            <button
              onClick={handleResetDatabase}
              disabled={dbStatus === 'resetting'}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-secondary/40 text-xs font-heading font-semibold uppercase text-white transition-all transform active:scale-98"
            >
              {dbStatus === 'resetting' ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-secondary" />
                  Syncing Database...
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                  Reset Database Cache
                </>
              )}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/15">
            <h3 className="font-heading font-bold text-secondary text-md mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-secondary" />
              Developer Mode
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              Google Firebase Auth adaptors and Firestore endpoints are active. Fallback engine is loaded client-side.
            </p>
          </div>

        </div>

      </div>

      {/* Trending Destinations */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="font-heading font-bold text-white text-lg mb-6 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#EC4899]" />
          Popularity Analytics
        </h3>
        <div className="flex flex-col gap-4">
          {trendingDestinations.map((dest, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{dest.title}</span>
                <span className="text-muted">{dest.saves} saved configurations</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary" 
                  style={{ width: `${dest.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default AdminDashboard;
