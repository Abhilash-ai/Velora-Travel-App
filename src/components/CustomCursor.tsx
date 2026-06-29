import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { MoveHorizontal } from 'lucide-react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1; // 1 to 4 px
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsla(210, 100%, 70%, ${Math.random()})`; // light blue stardust
    this.maxLife = Math.random() * 30 + 30; // frames
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export const CustomCursor: React.FC = () => {
  const { variant, text } = useCursor();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Update mouse position and spawn particles
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Calculate distance moved
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Spawn particles based on distance
      if (dist > 5) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(new Particle(e.clientX, e.clientY));
        }
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  // Animation Loop for Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
      border: '1px solid rgba(0, 0, 0, 0.5)',
      mixBlendMode: 'normal' as const,
      opacity: 1,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      width: 64,
      height: 64,
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      border: '1px solid rgba(37, 99, 235, 0.8)',
      mixBlendMode: 'normal' as const,
      opacity: 1,
    },
    explore: {
      x: mousePosition.x - 45,
      y: mousePosition.y - 45,
      width: 90,
      height: 90,
      backgroundColor: 'rgba(37, 99, 235, 0.9)',
      border: 'none',
      mixBlendMode: 'normal' as const,
      opacity: 1,
    },
    journey: {
      x: mousePosition.x - 60,
      y: mousePosition.y - 60,
      width: 120,
      height: 120,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      border: 'none',
      mixBlendMode: 'normal' as const,
      opacity: 1,
    },
    drag: {
      x: mousePosition.x - 45,
      y: mousePosition.y - 45,
      width: 90,
      height: 90,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(0,0,0,0.1)',
      mixBlendMode: 'normal' as const,
      opacity: 1,
      color: '#000',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <>
      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      
      {/* Magnetic/Spring Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center font-heading font-bold text-xs tracking-wider text-center overflow-hidden"
        style={{ color: variant === 'drag' ? '#0f172a' : '#ffffff' }}
        variants={variants}
        animate={variant}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
          mass: 0.5,
        }}
      >
        {(variant === 'explore' || variant === 'journey') && text}
        {variant === 'drag' && (
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <MoveHorizontal className="w-4 h-4" />
            <span>DRAG</span>
          </div>
        )}
      </motion.div>
      
      {/* Instant Follower Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.05
        }}
      />
    </>
  );
};
