import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import { useRef, useMemo, useState, Suspense } from "react";
import * as THREE from "three";

interface Props {
  isTyping: boolean;
  color?: string;
}

function HologramMesh({ isTyping, color = "#a78bfa" }: { isTyping: boolean; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speedMultiplier = isTyping ? 3.0 : 1.0;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.4 * speedMultiplier;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
      
      // Dynamic scale pulsing
      const pulseFreq = isTyping ? 6.0 : 2.0;
      const pulseAmp = isTyping ? 0.08 : 0.03;
      const scale = 1.0 + Math.sin(time * pulseFreq) * pulseAmp;
      meshRef.current.scale.set(scale, scale, scale);
    }
    
    if (wireRef.current) {
      wireRef.current.rotation.y = -time * 0.2 * speedMultiplier;
      wireRef.current.rotation.x = -Math.cos(time * 0.35) * 0.15;
      const wireScale = isTyping ? 1.18 : 1.12;
      wireRef.current.scale.set(wireScale, wireScale, wireScale);
    }
  });

  return (
    <group>
      {/* Morphing crystal core */}
      <Sphere ref={meshRef} args={[0.9, 8, 8]}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isTyping ? 1.4 : 0.65}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </Sphere>

      {/* Rotating outer cage */}
      <mesh ref={wireRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={isTyping ? 0.6 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function FloatingHologramParticles({ isTyping, color }: { isTyping: boolean; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 75;
  
  const [particles, pointsArray] = useMemo(() => {
    const pts = [];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 0.4;
      const x = r * Math.cos(theta);
      const y = (Math.random() - 0.5) * 1.5;
      const z = r * Math.sin(theta);
      
      pts.push({
        x, y, z,
        speed: 0.8 + Math.random() * 1.2,
        origY: y,
      });
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return [pts, arr];
  }, []);
  
  useFrame((state) => {
    const pos = pointsRef.current?.geometry.attributes.position;
    if (!pos) return;
    const speed = isTyping ? 3.0 : 1.0;
    
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      // Floating upwards animation loop
      let y = pos.getY(i) + 0.006 * p.speed * speed;
      if (y > 1.8) {
        y = -1.2; // reset to bottom
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointsArray, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={isTyping ? 0.95 : 0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function MentorHologram({ isTyping, color = "#a78bfa" }: Props) {
  return (
    <div className="relative h-48 w-48 mx-auto overflow-hidden rounded-full border border-white/5 bg-black/30 backdrop-blur shadow-glow">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.8} color={color} />
          <pointLight position={[-5, -5, -5]} intensity={1.0} color="#38bdf8" />
          <Stars radius={10} depth={5} count={50} factor={1} saturation={0.5} speed={0.4} />
          
          <HologramMesh isTyping={isTyping} color={color} />
          <FloatingHologramParticles isTyping={isTyping} color={color} />
        </Suspense>
      </Canvas>
      {/* Speaking/Pulse ring overlays */}
      <div 
        className={`absolute inset-0 rounded-full border border-white/5 pointer-events-none transition-all duration-700 ${
          isTyping ? "animate-pulse-ring" : ""
        }`}
      />
    </div>
  );
}
export default MentorHologram;
