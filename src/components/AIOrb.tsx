import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import type { Mesh, Points, LineSegments } from "three";
import * as THREE from "three";

// Glowing rim shader for the outer aura of the orb
const GlowShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float intensity = pow(0.8 - max(dot(normal, viewDir), 0.0), 2.2);
      gl_FragColor = vec4(0.64, 0.44, 1.0, 1.0) * intensity * 1.5;
    }
  `
};

function NeuralNetwork() {
  const pointsRef = useRef<Points>(null);
  const linesRef = useRef<LineSegments>(null);
  const count = 60;
  
  // Create initial random points in a spherical shell
  const [particles, pointsArray, linesArray] = useMemo(() => {
    const pts = [];
    const ptsArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 + Math.random() * 0.5; // spherical shell radius
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pts.push({
        x, y, z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
        r
      });
      
      ptsArray[i * 3] = x;
      ptsArray[i * 3 + 1] = y;
      ptsArray[i * 3 + 2] = z;
    }
    
    // Max possible lines is count * (count - 1) / 2
    const maxLines = 300;
    const lArray = new Float32Array(maxLines * 2 * 3);
    
    return [pts, ptsArray, lArray];
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update particle positions (slow rotation + noise)
    const posAttr = pointsRef.current?.geometry.attributes.position;
    if (!posAttr) return;
    
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      // Orbit around Y axis + slight vertical wave
      const angle = time * 0.08 * p.speed + p.phase;
      const x = p.r * Math.cos(angle) * Math.sin(p.phase);
      const y = p.r * Math.sin(angle) * Math.sin(p.phase) + Math.sin(time * p.speed + p.phase) * 0.12;
      const z = p.r * Math.cos(p.phase) + Math.cos(time * p.speed + p.phase) * 0.08;
      
      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
    
    // Compute connections between nearby nodes
    const lineAttr = linesRef.current?.geometry.attributes.position;
    if (!lineAttr) return;
    
    let lineIdx = 0;
    const maxLines = 300;
    const maxDistance = 0.95;
    
    for (let i = 0; i < count; i++) {
      const x1 = posAttr.getX(i);
      const y1 = posAttr.getY(i);
      const z1 = posAttr.getZ(i);
      
      for (let j = i + 1; j < count; j++) {
        const x2 = posAttr.getX(j);
        const y2 = posAttr.getY(j);
        const z2 = posAttr.getZ(j);
        
        const dist = Math.sqrt((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2);
        
        if (dist < maxDistance && lineIdx < maxLines) {
          lineAttr.setXYZ(lineIdx * 2, x1, y1, z1);
          lineAttr.setXYZ(lineIdx * 2 + 1, x2, y2, z2);
          lineIdx++;
        }
      }
    }
    
    // Reset remaining elements in the line segments buffer
    for (let i = lineIdx; i < maxLines; i++) {
      lineAttr.setXYZ(i * 2, 0, 0, 0);
      lineAttr.setXYZ(i * 2 + 1, 0, 0, 0);
    }
    lineAttr.needsUpdate = true;
  });
  
  return (
    <group>
      {/* Neural network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsArray, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c084fc"
          size={0.06}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Neural network connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linesArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#38bdf8"
          transparent={true}
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function Orb() {
  const ref = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = time * 0.15;
      ref.current.rotation.x = Math.sin(time * 0.25) * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -time * 0.1;
      // Pulse the scale of the outer glow aura
      const pulse = 1.0 + Math.sin(time * 1.5) * 0.03;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4}>
      <group>
        {/* Core glowing sphere with metallic distortion */}
        <Sphere ref={ref} args={[1.3, 96, 96]}>
          <MeshDistortMaterial
            color="#a78bfa"
            emissive="#581c87"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={2.0}
            roughness={0.1}
            metalness={0.9}
            transparent={true}
            opacity={0.95}
          />
        </Sphere>

        {/* Outer glowing aura layer using a custom rim shader */}
        <Sphere ref={glowRef} args={[1.35, 64, 64]}>
          <shaderMaterial
            ref={glowMaterialRef}
            vertexShader={GlowShader.vertexShader}
            fragmentShader={GlowShader.fragmentShader}
            blending={THREE.AdditiveBlending}
            transparent={true}
            depthWrite={false}
          />
        </Sphere>

        {/* Dynamic neural connection network */}
        <NeuralNetwork />
      </group>
    </Float>
  );
}

export function AIOrb({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[6, 6, 6]} intensity={2.8} color="#c084fc" />
          <pointLight position={[-6, -4, 3]} intensity={2.0} color="#22d3ee" />
          <pointLight position={[0, -2, -4]} intensity={1.5} color="#ec4899" />
          <Stars radius={45} depth={30} count={1000} factor={2.5} saturation={0.5} fade speed={0.4} />
          <Orb />
        </Suspense>
      </Canvas>
    </div>
  );
}
