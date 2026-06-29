import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface CinematicVideoProps {
  src: string;
  className?: string;
  overlayOpacity?: number; // 0 to 1
  fallbackImage?: string;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({ 
  src, 
  className = "", 
  overlayOpacity = 0.5,
  fallbackImage = "/images/kashmir.png"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 10,
          enableWorker: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    } else {
      video.src = src;
    }
  }, [src]);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `url("${fallbackImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div 
        className="absolute inset-0 bg-[#060B16] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};
export default CinematicVideo;
