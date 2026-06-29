import React, { useRef } from 'react';
import { Clock, Plane, Coffee, Camera } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Magnetic } from '../ui/Magnetic';
import { seedDestinations } from '../../data/dbSeed';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedPackagesProps {
  onSelectDestination: (id: string) => void;
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({ onSelectDestination }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ladakhData = seedDestinations.find(d => d.id === 'ladakh');
  const goaData = seedDestinations.find(d => d.id === 'goa');

  const packages = [
    {
      id: 'ladakh',
      title: ladakhData?.title || "Ladakh Expedition",
      duration: ladakhData ? `${ladakhData.stops.length + 3} Days` : "5 Days",
      image: ladakhData?.image || "/images/ladakh.png",
      features: ["Flights included", "4-star Hotel", "Daily Breakfast", "Guided Tours"],
      price: ladakhData ? `₹${new Intl.NumberFormat('en-IN').format(parseInt(ladakhData.price))}` : "₹45,000"
    },
    {
      id: 'goa',
      title: goaData?.title || "Goan Beach Retreat",
      duration: goaData ? `${goaData.stops.length + 3} Days` : "7 Days",
      image: goaData?.image || "/images/goa.png",
      features: ["Beachfront Resort", "All Inclusive", "Airport Transfers", "Spa Credit"],
      price: goaData ? `₹${new Intl.NumberFormat('en-IN').format(parseInt(goaData.price))}` : "₹32,500"
    }
  ];

  useGSAP(() => {
    // Parallax background
    gsap.to('.bg-parallax', {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Staggered card reveals
    gsap.fromTo('.pkg-card', 
      { opacity: 0, y: 100, rotateX: 10 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        duration: 1, 
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.pkg-container',
          start: "top 80%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden perspective-1000">
      
      {/* Deep Parallax Background */}
      <div className="absolute inset-0 w-full h-[130%] -top-[15%] z-0 pointer-events-none overflow-hidden">
        <div 
          className="bg-parallax absolute inset-0 bg-[url('/images/kerala.png')] bg-cover bg-center opacity-10 dark:opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 pkg-container">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Exclusive Packages</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
            Take advantage of our specially curated travel packages. We've taken care of all the details so you can simply relax and enjoy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="pkg-card">
              <Tilt
                tiltMaxAngleX={5} 
                tiltMaxAngleY={5} 
                scale={1.02} 
                transitionSpeed={2000}
                className="h-full"
              >
                <div 
                  className="flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-slate-100 dark:border-slate-700 group h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden" style={{ transform: 'translateZ(30px)' }}>
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg backdrop-blur-md bg-blue-600/90 border border-white/20">
                      <Clock className="w-4 h-4" />
                      {pkg.duration}
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 md:w-3/5 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/50 relative" style={{ transform: 'translateZ(40px)' }}>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{pkg.title}</h3>
                      <div className="grid grid-cols-2 gap-y-5 gap-x-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            {idx === 0 && <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {idx === 1 && <Coffee className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {idx === 2 && <Coffee className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {idx === 3 && <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            <span className="text-sm font-semibold">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700 mt-auto relative z-20">
                      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{pkg.price}</span>
                      <Magnetic intensity={0.4}>
                        <button 
                          onClick={() => onSelectDestination(pkg.id)}
                          className="bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-slate-900 dark:hover:text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-600/30"
                        >
                          Book Now
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
