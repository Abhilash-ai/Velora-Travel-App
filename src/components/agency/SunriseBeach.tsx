import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SunriseBeach: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    // Pin the container to scrub through time of day
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true,
      }
    });

    // 1. Sunrise -> Morning (Sky turns from dawn orange to bright blue)
    tl.to(skyRef.current, {
      background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)",
      duration: 1
    });

    tl.to(textRef1.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5");
    tl.to(textRef1.current, { opacity: 0, y: -20, duration: 0.5 }, "+=0.5");

    // 2. Morning -> Golden Hour (Sky turns golden/orange)
    tl.to(skyRef.current, {
      background: "linear-gradient(to bottom, #FF8C00 0%, #FFD700 100%)",
      duration: 1
    });

    tl.to(textRef2.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.5");

    // 3. Golden Hour -> Sunset (Sky turns deep purple/red)
    tl.to(skyRef.current, {
      background: "linear-gradient(to bottom, #2C1B4D 0%, #D45079 100%)",
      duration: 1
    });
    
    tl.to(textRef2.current, { opacity: 0, y: -20, duration: 0.5 });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Sky Background */}
      <div 
        ref={skyRef} 
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(to bottom, #FF7B54 0%, #FFD56F 100%)" }} // Initial Dawn
      />
      
      {/* Ocean & Beach (Mix blend or transparent PNG) */}
      <div className="absolute inset-0 w-full h-full z-10 bg-[url('/images/andaman.png')] bg-cover bg-center opacity-80 mix-blend-multiply" />

      {/* Atmospheric Fog */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none z-20" />

      {/* Text Reveals */}
      <div className="relative z-30 flex items-center justify-center h-full text-center px-4">
        <h2 
          ref={textRef1}
          className="absolute text-5xl md:text-7xl font-bold text-white drop-shadow-2xl opacity-0 translate-y-10"
        >
          Watch the world awaken.
        </h2>
        
        <h2 
          ref={textRef2}
          className="absolute text-5xl md:text-7xl font-bold text-white drop-shadow-2xl opacity-0 translate-y-10"
        >
          Travel isn't a destination.<br/>It's a feeling.
        </h2>
      </div>
    </section>
  );
};
