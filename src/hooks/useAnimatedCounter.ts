import { useState, useEffect } from 'react';

export const useAnimatedCounter = (
  target: number, 
  duration: number = 1500, 
  startTrigger: boolean = true
): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) {
      setCount(0);
      return;
    }
    
    let startTimestamp: number | null = null;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad (slows down towards the end)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const animationFrame = window.requestAnimationFrame(step);
    
    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, startTrigger]);

  return count;
};
export default useAnimatedCounter;
