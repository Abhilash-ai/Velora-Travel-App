import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const BeforeAfterSlider: React.FC<{ beforeImage: string, afterImage: string, labelBefore: string, labelAfter: string, beforeClass?: string, afterClass?: string }> = ({ beforeImage, afterImage, labelBefore, labelAfter, beforeClass = '', afterClass = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setVariant } = useCursor();

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-2xl cursor-none group touch-none shadow-2xl border border-slate-100 dark:border-slate-800"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseEnter={() => setVariant('drag')}
      onMouseLeave={() => setVariant('default')}
    >
      {/* After Image (Background) */}
      <img src={afterImage} alt="After" className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${afterClass}`} />
      
      {/* Before Image (Foreground with Clip) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={beforeImage} alt="Before" className={`absolute inset-0 w-full h-full object-cover ${beforeClass}`} />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-1 h-4 border-l border-r border-slate-400 mx-auto" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {labelBefore}
      </div>
      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {labelAfter}
      </div>
    </div>
  );
};

export const TransformativeJourneys: React.FC = () => {
  return (
    <section className="w-full py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Transformative Journeys</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Experience the magic of our destinations. Drag the slider to see how they transform from Day to Night.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <BeforeAfterSlider 
              beforeImage="/images/kerala.png" 
              afterImage="/images/kerala_sunset.png"
              labelBefore="Kerala (Day)"
              labelAfter="Kerala (Sunset)"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BeforeAfterSlider 
              beforeImage="/images/rajasthan.png" 
              afterImage="/images/rajasthan_night.png"
              labelBefore="Jaipur (Day)"
              labelAfter="Jaipur (Night)"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <BeforeAfterSlider 
              beforeImage="/images/kashmir.png" 
              afterImage="/images/kashmir_winter.png"
              labelBefore="Kashmir (Summer)"
              labelAfter="Kashmir (Winter)"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <BeforeAfterSlider 
              beforeImage="/images/hampi.png" 
              afterImage="/images/hampi_night.png"
              labelBefore="Hampi (Day)"
              labelAfter="Hampi (Twilight)"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
