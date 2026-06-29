import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { SeedDestination } from '../data/dbSeed';
import { useCursor } from '../context/CursorContext';
import earthMapUrl from '../assets/earth-map.jpg';
import earthSpecularUrl from '../assets/earth-specular.jpg';

interface R3FGlobeProps {
  destinations: SeedDestination[];
  onDestinationSelect: (dest: SeedDestination) => void;
  selectedDestination: SeedDestination | null;
}

// Math util for standard Three.js SphereGeometry mapping
const getSphericalPosition = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi)
  );
};

const GlobeMesh: React.FC<{ destinations: SeedDestination[], onSelect: (d: SeedDestination) => void, selected: SeedDestination | null }> = ({ destinations, onSelect, selected }) => {
  const globeRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const { setVariant, setText } = useCursor();

  // Load textures
  const [map, specularMap] = useLoader(THREE.TextureLoader, [
    earthMapUrl,
    earthSpecularUrl
  ]);

  // Smoothly fly camera to selected destination
  useFrame((_, delta) => {
    if (selected && globeRef.current) {
      const rx = selected.lat * (Math.PI / 180);
      const ry = -(selected.lng + 90) * (Math.PI / 180);

      globeRef.current.rotation.y = THREE.MathUtils.damp(globeRef.current.rotation.y, ry, 3, delta);
      globeRef.current.rotation.x = THREE.MathUtils.damp(globeRef.current.rotation.x, rx, 3, delta);
    } else if (globeRef.current) {
      // Auto-rotate slowly when idle
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <group ref={globeRef} rotation-order="YXZ">
        {/* The Earth */}
        <mesh>
          <sphereGeometry args={[10, 64, 64]} />
          <meshPhongMaterial
            map={map}
            specularMap={specularMap}
            specular={new THREE.Color('grey')}
            shininess={15}
          />
        </mesh>

        {/* Atmosphere Glow */}
        <mesh>
          <sphereGeometry args={[10.3, 64, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>

        {/* Markers */}
        {destinations.map((dest) => {
          const pos = getSphericalPosition(dest.lat, dest.lng, 10.1);
          const isSelected = selected?.id === dest.id;
          const isSpiritual = dest.id.includes('spiritual') || dest.title.includes('Temple') || dest.title.includes('Jyotirlinga');

          return (
            <Html
              key={dest.id}
              position={pos}
              center
              zIndexRange={[100, 0]}
              distanceFactor={15}
            >
              <div 
                className={`cursor-pointer group flex flex-col items-center transition-transform duration-500 hover:scale-150 ${isSelected ? 'scale-150' : ''}`}
                onClick={() => onSelect(dest)}
                onMouseEnter={() => { setVariant('explore'); setText('Explore'); }}
                onMouseLeave={() => { setVariant('default'); setText(''); }}
              >
                {/* Ping animation */}
                <div className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${isSpiritual ? 'bg-amber-400' : 'bg-pink-500'}`} />
                {/* Core pin */}
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] ${isSpiritual ? 'bg-amber-500' : 'bg-pink-500'}`} />
                
                {/* Label */}
                <div className={`mt-2 px-2 py-0.5 rounded-md text-[10px] font-heading font-bold whitespace-nowrap backdrop-blur-md border border-white/20 transition-opacity duration-300 ${isSelected ? 'opacity-100 bg-white text-black' : 'opacity-0 group-hover:opacity-100 bg-black/50 text-white'}`}>
                  {dest.title}
                </div>
              </div>
            </Html>
          );
        })}
      </group>

      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={15}
        maxDistance={40}
        zoomSpeed={0.8}
        rotateSpeed={0.6}
      />
    </>
  );
};

export const R3FGlobe: React.FC<R3FGlobeProps> = ({ destinations, onDestinationSelect, selectedDestination }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
        <color attach="background" args={['#02050A']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <GlobeMesh 
          destinations={destinations} 
          onSelect={onDestinationSelect} 
          selected={selectedDestination} 
        />
      </Canvas>
    </div>
  );
};
