import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Sun, Droplets, Landmark, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const biomes = [
  {
    id: 'himalayas',
    title: 'The High Himalayas',
    subtitle: 'Touch the sky',
    fact: 'The Indian Himalayas span over 2,500 km, home to some of the highest peaks on Earth.',
    bg: '/images/ladakh.png',
    icon: <Leaf className="w-8 h-8 text-emerald-400" />
  },
  {
    id: 'desert',
    title: 'The Great Thar',
    subtitle: 'Golden dunes stretching to eternity',
    fact: 'The Thar Desert is the world\'s 9th largest subtropical desert.',
    bg: '/images/rajasthan.png',
    icon: <Sun className="w-8 h-8 text-amber-400" />
  },
  {
    id: 'coasts',
    title: 'Pristine Coasts',
    subtitle: 'Where the ocean meets the soul',
    fact: 'India boasts over 7,500 km of magnificent coastline and tropical islands.',
    bg: '/images/andaman.png',
    icon: <Droplets className="w-8 h-8 text-cyan-400" />
  },
  {
    id: 'temples',
    title: 'Sacred Architecture',
    subtitle: 'Millennia of devotion carved in stone',
    fact: 'There are over 2 million Hindu temples across the Indian subcontinent.',
    bg: '/images/hampi.png',
    icon: <Landmark className="w-8 h-8 text-orange-400" />
  },
  {
    id: 'backwaters',
    title: 'Tranquil Backwaters',
    subtitle: 'Navigate the emerald labyrinth',
    fact: 'The Kerala Backwaters are a network of 1500 km of interconnected canals and lakes.',
    bg: '/images/kerala.png',
    icon: <Droplets className="w-8 h-8 text-blue-400" />
  },
  {
    id: 'cities',
    title: 'Modern Megacities',
    subtitle: 'Where the future meets tradition',
    fact: 'Mumbai and Bangalore are leading global hubs for technology and culture.',
    bg: '/images/megacity.png',
    icon: <Building2 className="w-8 h-8 text-blue-400" />
  }
];

export const BiomeJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const panels = panelRefs.current;
    
    // Pin the container and crossfade the panels
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // 5 sections of scroll depth (6 panels total)
        scrub: 1,
        pin: true,
      }
    });

    // We start with the first panel visible.
    // For each subsequent panel, we fade it in over the previous one.
    panels.forEach((panel, i) => {
      if (i === 0) return; // First is already visible
      
      const content = panel?.querySelector('.biome-content');
      
      // Initially hide content of next panels
      gsap.set(panel, { opacity: 0 });
      if (content) gsap.set(content, { y: 50, opacity: 0 });

      // Fade in the background
      tl.to(panel, { opacity: 1, duration: 1, ease: "none" }, i - 0.5);
      
      // Animate content up
      if (content) {
        tl.to(content, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, i);
      }
      
      // Fade out previous content slightly to draw focus
      const prevContent = panels[i - 1]?.querySelector('.biome-content');
      if (prevContent) {
        tl.to(prevContent, { y: -50, opacity: 0, duration: 0.5, ease: "power2.in" }, i - 0.5);
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {biomes.map((biome, i) => (
        <div 
          key={biome.id}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: i }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105"
            style={{ backgroundImage: `url(${biome.bg})` }}
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="biome-content relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-4xl mx-auto">
            <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {biome.icon}
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-2xl mb-4">
              {biome.title}
            </h2>
            <p className="text-xl md:text-3xl text-white/90 font-medium mb-12 italic">
              {biome.subtitle}
            </p>
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-6 rounded-2xl max-w-2xl transform hover:scale-105 transition-transform duration-500">
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                {biome.fact}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Scroll indicator overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 opacity-50">
        <span className="text-white/70 text-sm tracking-widest uppercase font-bold">Keep Scrolling</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
};
