import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface WordRevealProps {
  text: string;
  highlights: string[];
}

const Word = ({ children, progress, range, isHighlight }: { children: string, progress: any, range: number[], isHighlight: boolean }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative inline-block mr-3 mb-2">
      <span className="absolute opacity-10">{children}</span>
      <motion.span 
        style={{ opacity }}
        className={isHighlight ? "text-white font-serif italic" : "text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const WordReveal: React.FC<WordRevealProps> = ({ text, highlights }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium leading-[1.3] max-w-5xl text-center flex flex-wrap justify-center tracking-tight"
    >
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "").toLowerCase();
        const isHighlight = highlights.some(h => cleanWord === h.toLowerCase());
        
        const start = idx / words.length;
        const end = start + (1 / words.length);

        return (
          <Word key={idx} progress={scrollYProgress} range={[start, end]} isHighlight={isHighlight}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default WordReveal;
