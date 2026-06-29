import React, { useRef } from 'react';
import { ShieldCheck, PlaneTakeoff, HeartHandshake, HeadphonesIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from '../ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

export const WhyChooseUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const reasons = [
    {
      icon: ShieldCheck,
      title: "Secure Booking",
      desc: "Your transactions and personal data are protected by industry-leading security protocols."
    },
    {
      icon: PlaneTakeoff,
      title: "Best Price Guarantee",
      desc: "We negotiate directly with airlines and hotels to bring you the lowest possible rates."
    },
    {
      icon: HeartHandshake,
      title: "Curated Experiences",
      desc: "Every tour and activity is hand-picked by our local travel experts for quality."
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      desc: "Our travel concierges are always available to help you, no matter what time zone you're in."
    }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo('.why-title', 
      { opacity: 0, y: 50, rotateX: -45 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power3.out" }
    );

    tl.fromTo('.why-card',
      { opacity: 0, y: 60, scale: 0.9, rotateY: 30 },
      { opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-32 bg-white dark:bg-slate-900 relative perspective-1000 transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-slate-100 dark:bg-slate-800/50 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 why-title" style={{ transformStyle: 'preserve-3d' }}>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Why Book With Velora?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
            We take the stress out of travel planning so you can focus on making memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div 
                key={idx} 
                className="why-card bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-[0_20px_60px_rgba(37,99,235,0.1)] dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.2)] transition-all duration-500 hover:-translate-y-2 group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Magnetic intensity={0.5}>
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-600 rounded-full flex items-center justify-center mb-8 transition-colors duration-500 shadow-inner">
                    <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-500" />
                  </div>
                </Magnetic>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{reason.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
