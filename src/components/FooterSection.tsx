import React, { useRef } from 'react';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onLinkClick: (id: string) => void;
  onOpenPlanner: () => void;
  onOpenJourney: () => void;
}

export const FooterSection: React.FC<FooterProps> = ({ onLinkClick, onOpenPlanner }) => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Curtain Reveal Effect: The footer appears to be "underneath" the rest of the site
    // As you scroll down the last part of the page, the footer reveals itself from the bottom.
    gsap.fromTo(contentRef.current, 
      { y: -150, scale: 0.95 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative w-full bg-[#050505] text-slate-300 py-24 overflow-hidden z-0">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 border-b border-white/10 pb-20">
          
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 text-white">
              <img src="/images/logo.png" alt="Velora Travel Logo" className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-contain shadow-[0_0_30px_rgba(37,99,235,0.2)]" />
              <div className="flex flex-col">
                <span className="font-heading font-black text-3xl tracking-tight">
                  Velora
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              Discover the world's most beautiful destinations and book your next unforgettable journey with us.
            </p>
            <div className="flex gap-4">
              <Magnetic intensity={0.4}><a href="#" className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"><Globe className="w-5 h-5" /></a></Magnetic>
              <Magnetic intensity={0.4}><a href="#" className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></a></Magnetic>
              <Magnetic intensity={0.4}><a href="#" className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"><Phone className="w-5 h-5" /></a></Magnetic>
              <Magnetic intensity={0.4}><a href="#" className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-colors"><MapPin className="w-5 h-5" /></a></Magnetic>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8">Quick Links</h4>
            <ul className="flex flex-col gap-5 text-lg">
              <li><Magnetic intensity={0.1}><button onClick={() => onLinkClick('discover')} className="hover:text-white hover:translate-x-2 transition-all">Destinations</button></Magnetic></li>
              <li><Magnetic intensity={0.1}><button className="hover:text-white hover:translate-x-2 transition-all">Packages</button></Magnetic></li>
              <li><Magnetic intensity={0.1}><button onClick={() => onOpenPlanner()} className="hover:text-white hover:translate-x-2 transition-all">AI Planner</button></Magnetic></li>
              <li><Magnetic intensity={0.1}><button className="hover:text-white hover:translate-x-2 transition-all">About Us</button></Magnetic></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8">Support</h4>
            <ul className="flex flex-col gap-5 text-lg">
              <li><Magnetic intensity={0.1}><a href="#" className="hover:text-white hover:translate-x-2 transition-all">Help Center</a></Magnetic></li>
              <li><Magnetic intensity={0.1}><a href="#" className="hover:text-white hover:translate-x-2 transition-all">Contact Us</a></Magnetic></li>
              <li><Magnetic intensity={0.1}><a href="#" className="hover:text-white hover:translate-x-2 transition-all">Privacy Policy</a></Magnetic></li>
              <li><Magnetic intensity={0.1}><a href="#" className="hover:text-white hover:translate-x-2 transition-all">Terms of Service</a></Magnetic></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8">Newsletter</h4>
            <p className="text-slate-400 mb-6 text-lg">Subscribe for the latest travel deals and destination guides.</p>
            <div className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
              <Magnetic intensity={0.2}>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 py-4 font-bold transition-colors shadow-lg hover:shadow-blue-500/25">
                  Subscribe
                </button>
              </Magnetic>
            </div>
          </div>

        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Velora Travel Agency. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-2">Crafted with GSAP & React</p>
        </div>
      </div>
    </footer>
  );
};
