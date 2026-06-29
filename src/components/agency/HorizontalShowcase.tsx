import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { seedDestinations } from '../../data/dbSeed';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalShowcaseProps {
  onSelectDestination: (id: string) => void;
}

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = ({ onSelectDestination }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollWrapperRef.current) return;
    
    gsap.to(scrollWrapperRef.current, {
      x: () => -(scrollWrapperRef.current!.scrollWidth - window.innerWidth + 100), // +100 for some padding at the end
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + (scrollWrapperRef.current?.scrollWidth || 2000),
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-slate-900 overflow-hidden flex items-center">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="absolute top-12 left-12 md:left-24 z-20">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Explore the Extraordinary</h2>
        <p className="text-slate-400 mt-2 text-lg">Scroll to journey across India</p>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div ref={scrollWrapperRef} className="flex h-full items-center pl-12 md:pl-24 pt-20">
        {seedDestinations.map((dest) => (
          <div 
            key={dest.id} 
            className="destination-card w-[85vw] md:w-[600px] h-[60vh] md:h-[70vh] flex-shrink-0 mr-8 md:mr-16 relative group rounded-3xl overflow-hidden"
          >
            {/* Dedicated clickable layer covering the whole card */}
            <button 
              className="absolute inset-0 w-full h-full z-[100] cursor-pointer opacity-0 focus:outline-none"
              onClick={() => onSelectDestination(dest.id)}
              aria-label={`View details for ${dest.title}`}
            />
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 pointer-events-none" />
            
            {/* Image with Parallax/Zoom effect */}
            <img 
              src={dest.image} 
              alt={dest.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Glassmorphism Content Box */}
            <div className="absolute bottom-6 left-6 right-6 p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{dest.title}</h3>
                  <div className="flex items-center gap-1 text-white/80 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {dest.country}
                  </div>
                </div>
                <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm">
                  ₹{new Intl.NumberFormat('en-IN').format(parseInt(dest.price))}
                </div>
              </div>
              
              <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
                {dest.description}
              </p>

              <div className="flex gap-4 border-t border-white/20 pt-4">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Calendar className="w-4 h-4" />
                  {dest.bestTime.split(' ')[0]}
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  {dest.stops.length + 3} Days
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Extra space at the end to ensure the last card stops in the middle */}
        <div className="w-[10vw] flex-shrink-0" />
      </div>
    </section>
  );
};
