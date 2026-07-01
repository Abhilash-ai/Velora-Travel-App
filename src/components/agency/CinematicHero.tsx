import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroProps {
  onExplore: () => void;
  onPlan: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onExplore, onPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<HTMLImageElement>(null);
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
      }
    });

    // Camera move forward (scale up mountains)
    tl.to(mountainRef.current, {
      scale: 1.2,
      y: 50,
      ease: "none"
    }, 0);

    // Part the clouds
    tl.to(cloudLeftRef.current, {
      x: "-100%",
      opacity: 0,
      ease: "none"
    }, 0);

    tl.to(cloudRightRef.current, {
      x: "100%",
      opacity: 0,
      ease: "none"
    }, 0);

    // Fade and move text up
    tl.to(textRef.current, {
      y: -100,
      opacity: 0,
      ease: "none"
    }, 0);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Background Sky & Mountains */}
      <img 
        ref={mountainRef}
        src="/images/uttarakhand.png" 
        alt="Himalayas"
        className="absolute inset-0 w-full h-full object-cover scale-105 origin-bottom"
      />
      
      {/* Floating Particles / Snow */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[snow_20s_linear_infinite]" />
      </div>

      {/* Atmospheric Fog at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10" />

      {/* Clouds Parting */}
      <div 
        ref={cloudLeftRef}
        className="absolute top-0 left-0 w-1/2 h-full z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at right center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)'
        }}
      />
      <div 
        ref={cloudRightRef}
        className="absolute top-0 right-0 w-1/2 h-full z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at left center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Hero Content */}
      <div 
        ref={textRef}
        className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4 pt-32"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white/80 uppercase tracking-[0.5em] text-sm md:text-base font-medium mb-6"
        >
          {t('hero.badge')}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter drop-shadow-2xl mb-12"
          style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
        >
          {t('hero.title1')}<br/>{t('hero.title2')}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <button onClick={onExplore} className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
            {t('destinations.explore')}
          </button>
          <button onClick={onPlan} className="px-8 py-4 bg-transparent border border-white/30 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/10 transition-colors">
            {t('hero.cta')}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
