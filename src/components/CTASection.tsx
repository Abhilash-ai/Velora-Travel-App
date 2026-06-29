import React, { useRef } from 'react';
import { Sparkles, Map } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onStartExploring: () => void;
  onCreatePlan: () => void;
}

export const CTASection: React.FC<CTAProps> = ({ onStartExploring, onCreatePlan }) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.cta-content', 
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)" }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-blue-600 overflow-hidden">
      {/* Decorative background shapes with CSS parallax */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/2"></div>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center cta-content">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
          Ready for your next adventure?
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium">
          Whether you want to browse beautiful destinations or have our AI plan a complete itinerary for you, we're here to help.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Magnetic intensity={0.3}>
            <button 
              onClick={onStartExploring}
              className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-full font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
            >
              <Map className="w-6 h-6" />
              Explore Destinations
            </button>
          </Magnetic>
          <Magnetic intensity={0.3}>
            <button 
              onClick={onCreatePlan}
              className="w-full sm:w-auto bg-blue-700/50 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              Create AI Itinerary
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};
