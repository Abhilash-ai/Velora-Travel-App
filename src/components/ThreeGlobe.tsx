import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import type { SeedDestination } from '../data/dbSeed';

// Import textures via Vite asset pipeline for robust URL resolution
import earthMapUrl from '../assets/earth-map.jpg';
import earthLightsUrl from '../assets/earth-lights.png';
import earthSpecularUrl from '../assets/earth-specular.jpg';

interface ThreeGlobeProps {
  destinations: SeedDestination[];
  onSelectDestination: (dest: SeedDestination | null) => void;
  selectedDestination: SeedDestination | null;
}

// Custom shaders for the glowing purple atmospheric rim
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    // Glow intensifies at the edge of the sphere sphere
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    // A beautiful purple glow matching Velora's primary brand color (#7C3AED)
    gl_FragColor = vec4(0.49, 0.23, 0.93, 1.0) * intensity;
  }
`;

export const ThreeGlobe: React.FC<ThreeGlobeProps> = ({
  destinations,
  onSelectDestination,
  selectedDestination
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  
  // Track pulsing rings for independent animations
  const pulsingRingsRef = useRef<{ mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; speed: number }[]>([]);

  // Interaction variables
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.2, y: 0 });
  const currentRotation = useRef({ x: 0.2, y: 0 });
  const clickStartTime = useRef(0);
  const clickStartPos = useRef({ x: 0, y: 0 });

  // Convert Lat/Lng to 3D Cartesian coordinates on sphere of radius R.
  // Perfectly aligned with the UV coordinates of THREE.SphereGeometry.
  const convertLatLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.cos(phi),
      radius * Math.sin(theta) * Math.sin(phi)
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // Reset pulsing rings cache
    pulsingRingsRef.current = [];

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Create Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 13;
    cameraRef.current = camera;

    // 3. Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Create Globe Group with 'YXZ' rotation order
    const globeGroup = new THREE.Group();
    globeGroup.rotation.order = 'YXZ';
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 5. Globe sphere geometry & materials (high segments for smooth texture wrap)
    const globeRadius = 4.2;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Load imported texture maps via Vite compilation
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load(earthMapUrl);
    const earthLights = textureLoader.load(earthLightsUrl);
    const earthSpecular = textureLoader.load(earthSpecularUrl);

    // Textures fine tuning
    earthMap.minFilter = THREE.LinearFilter;
    earthLights.minFilter = THREE.LinearFilter;
    earthSpecular.minFilter = THREE.LinearFilter;

    // Premium Slate-Dark Luxury material (White base color for maximum texture visibility)
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: earthMap,
      roughnessMap: earthSpecular,
      roughness: 0.9,
      metalness: 0.1,
      emissiveMap: earthLights,
      emissive: new THREE.Color(0xffbb77), // Beautiful warm golden glow for city lights
      emissiveIntensity: 2.5
    });

    const globeMesh = new THREE.Mesh(sphereGeo, globeMat);
    globeGroup.add(globeMesh);

    // Glowing atmosphere outer ring
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.15, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // 6. Faint grid lines (latitude/longitude grids) for a high-tech visual touch
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED, // Purple
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const wireframeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // 7. Pins Group (holds coordinates markers)
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    destinations.forEach((dest) => {
      const position = convertLatLngToVector3(dest.lat, dest.lng, globeRadius);
      
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(position);
      
      // Orient the pin outwards from the sphere surface
      pinGroup.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.rotateX(Math.PI / 2);

      // Pin core dot
      const dotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xEC4899, // Pink
        transparent: true,
        opacity: 0.95
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      pinGroup.add(dotMesh);

      // Pin outer ring (for pulsing sonar effect)
      const ringGeo = new THREE.RingGeometry(0.14, 0.22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x7C3AED, // Purple
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ringMesh);

      // Push into pulsing rings animation array
      pulsingRingsRef.current.push({
        mesh: ringMesh,
        material: ringMat,
        speed: 0.015 + Math.random() * 0.01
      });

      // Glowing vertical beacon cylinder (spotlight ray pointing outwards)
      const beaconGeo = new THREE.CylinderGeometry(0.005, 0.06, 0.7, 16, 1, true);
      // Translate the cylinder up by half its height so its base sits exactly on the surface
      beaconGeo.translate(0, 0.35, 0);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xEC4899, // Pink
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      pinGroup.add(beaconMesh);

      // Save reference to destination object on the interactive elements
      dotMesh.userData = { destination: dest };
      beaconMesh.userData = { destination: dest };

      pinsGroup.add(pinGroup);
    });

    // 8. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Warm main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(6, 4, 6);
    scene.add(mainLight);

    // Cool rim light for theatrical edge reflections
    const blueFillLight = new THREE.DirectionalLight(0x7C3AED, 0.6);
    blueFillLight.position.set(-6, -2, -6);
    scene.add(blueFillLight);

    // 9. Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Apply rotation interpolation (damping) for drag controls
      if (!isDragging.current) {
        // Slow auto-rotation when not dragging
        targetRotation.current.y += 0.0018;
      }

      // Increased damping multiplier from 0.08 to 0.15 for snappier dragging catching up
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.15;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.15;

      if (globeGroup) {
        globeGroup.rotation.x = currentRotation.current.x;
        globeGroup.rotation.y = currentRotation.current.y;
      }

      // Animate pulsing sonar waves
      pulsingRingsRef.current.forEach((item) => {
        let scale = item.mesh.scale.x + item.speed;
        if (scale > 2.5) {
          scale = 1.0;
        }
        item.mesh.scale.set(scale, scale, 1);
        item.material.opacity = 0.65 * (1.0 - (scale - 1.0) / 1.5);
      });

      renderer.render(scene, camera);
    };
    
    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return; // Prevent division-by-zero or NaN aspect ratios
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // Use ResizeObserver for high-fidelity element container scaling
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      // Deep scene traversal cleanup to prevent WebGL memory leaks
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat) => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }

      // Dispose textures
      earthMap.dispose();
      earthLights.dispose();
      earthSpecular.dispose();

      // Dispose renderer
      if (renderer) {
        renderer.dispose();
      }

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [destinations]);

  // Click handler to select pin (Raycasting)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if it was a drag or a click
    const clickDuration = Date.now() - clickStartTime.current;
    const moveDistance = Math.sqrt(
      Math.pow(e.clientX - clickStartPos.current.x, 2) +
      Math.pow(e.clientY - clickStartPos.current.y, 2)
    );

    // If dragged more than 7 pixels or held longer than 300ms, ignore it as a drag
    if (moveDistance > 7 || clickDuration > 300) {
      return;
    }

    if (!rendererRef.current || !cameraRef.current || !pinsGroupRef.current) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Recursive search for intersects on the pins
    const intersects = raycaster.intersectObjects(pinsGroupRef.current.children, true);

    if (intersects.length > 0) {
      // Find the parent mesh holding destination data (dot or beacon)
      const intersectObj = intersects.find(obj => obj.object.userData?.destination);
      if (intersectObj) {
        const dest = intersectObj.object.userData.destination as SeedDestination;
        onSelectDestination(dest);
      }
    }
  };

  // Fly-to Zoom Camera animation when selectedDestination updates
  useEffect(() => {
    if (!selectedDestination || !cameraRef.current || !globeGroupRef.current) return;

    // Calculate correct rotation angles in 'YXZ' rotation order
    const rx = selectedDestination.lat * (Math.PI / 180);
    const ry = -(selectedDestination.lng + 90) * (Math.PI / 180);

    // Animate rotation & zoom using GSAP
    gsap.killTweensOf(targetRotation.current);
    gsap.killTweensOf(cameraRef.current.position);

    // Reduced duration from 1.8s to 0.8s and using a snappier ease for high responsiveness
    gsap.to(targetRotation.current, {
      x: rx,
      y: ry,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.to(cameraRef.current.position, {
      z: 6.8,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, [selectedDestination]);

  // Zoom back out when selectedDestination is cleared
  useEffect(() => {
    if (!selectedDestination && cameraRef.current) {
      // Reduced duration from 1.5s to 0.6s
      gsap.to(cameraRef.current.position, {
        z: 13,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }, [selectedDestination]);

  // Drag controls event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    clickStartTime.current = Date.now();
    clickStartPos.current = { x: e.clientX, y: e.clientY };
    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.current.x,
      y: e.clientY - previousMousePosition.current.y
    };

    // Increased drag speed multiplier from 0.005 to 0.008 for fast drag rotation
    targetRotation.current.y += deltaMove.x * 0.008;
    targetRotation.current.x += deltaMove.y * 0.008;

    // Cap the vertical rotation to avoid flipping upside down
    targetRotation.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotation.current.x));

    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    />
  );
};

export default ThreeGlobe;
