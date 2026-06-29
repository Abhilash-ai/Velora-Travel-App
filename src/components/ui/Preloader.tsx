import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500; // 2.5 seconds total loading
    const interval = 30; // update every 30ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuad = (t: number) => t * (2 - t);
      const newProgress = Math.min(Math.round(easeOutQuad(currentStep / steps) * 100), 100);
      
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Wait a bit at 100% before firing complete
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      key="preloader"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] text-white overflow-hidden"
      exit={{ 
        clipPath: "inset(0 0 100% 0)", 
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* 3D Spinny thing / Logo */}
      <motion.div 
        className="relative w-32 h-32 mb-12 flex items-center justify-center"
        animate={{ rotateY: 360, rotateX: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 border border-white/20 rounded-full" />
        <div className="absolute inset-2 border border-white/40 rounded-full" style={{ transform: "rotateX(60deg) rotateY(45deg)" }} />
        <div className="absolute inset-4 border border-white/60 rounded-full" style={{ transform: "rotateX(-60deg) rotateY(-45deg)" }} />
        <div className="absolute inset-6 border border-blue-500 rounded-full" style={{ transform: "rotateX(90deg)" }} />
      </motion.div>

      <div className="flex flex-col items-center">
        <h1 className="font-heading font-black tracking-[0.3em] uppercase text-xl mb-4 text-white/90">
          Velora
        </h1>
        <div className="flex items-baseline gap-1">
          <span className="text-6xl md:text-8xl font-light font-mono tracking-tighter">
            {progress}
          </span>
          <span className="text-xl md:text-3xl font-light text-white/50">%</span>
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 h-[1px] bg-white/20 mt-8 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
