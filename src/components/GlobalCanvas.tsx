import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { useSceneStore } from "@/hooks/use-scene-store";
import type { SceneMode } from "@/hooks/use-scene-store";

// Glowing outer rim shader for the AI Core
const RimGlowShader = {
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
    uniform vec3 uColor;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float intensity = pow(0.75 - max(dot(normal, viewDir), 0.0), 2.5);
      gl_FragColor = vec4(uColor, 1.0) * intensity * 1.6;
    }
  `
};

function CameraController() {
  const store = useSceneStore();
  const currentPos = useRef(new THREE.Vector3(0, 0, 8));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  
  useFrame((state) => {
    const targetPos = new THREE.Vector3(...store.cameraPosition);
    const targetLook = new THREE.Vector3(...store.cameraLookAt);
    
    // Smooth camera movements
    currentPos.current.lerp(targetPos, 0.08);
    currentLook.current.lerp(targetLook, 0.08);
    
    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLook.current);
  });
  
  return null;
}

function FloatingAICore() {
  const store = useSceneStore();
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse } = useThree(); // mouse coordinates normalized [-1,1]

  const currentPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!coreRef.current || !glowRef.current) return;
    const time = state.clock.elapsedTime;

    // Calculate base target position based on route state context
    const basePos = new THREE.Vector3(0, 0, 0);
    let targetScale = store.coreScale;

    switch (store.currentScene) {
      case "landing":
        basePos.set(1.1, 0, 0);
        // Add subtle mouse-driven offset (scaled down for subtlety)
        basePos.x += mouse.x * 0.4;
        basePos.y += mouse.y * 0.4;
        break;
      case "dashboard":
        basePos.set(1.8, 0.5, -0.5);
        break;
      case "roadmap":
        // Drop down below the custom galaxy view coordinates
        basePos.set(0, -7, 0);
        break;
      case "study-guide":
        basePos.set(-2.2, -0.6, -0.6);
        break;
      case "chat":
        basePos.set(-2.0, 0.5, -0.5);
        break;
      case "mentor":
        // Hidden to let the specialized hologram avatar mesh render
        basePos.set(0, -7, 0);
        break;
      case "analytics":
        basePos.set(1.9, 0.6, -0.5);
        break;
      default:
        basePos.set(0, 0, -2);
    }

    // Smooth lerp toward the (potentially mouse-adjusted) target
    currentPos.current.lerp(basePos, 0.08);
    coreRef.current.position.copy(currentPos.current);
    glowRef.current.position.copy(currentPos.current);

    // Determine opacity and base size per scene
    const sceneOpacity = {
      landing: 0.95,
      dashboard: 0.4,
      roadmap: 0.4,
      'study-guide': 0.4,
      chat: 0.4,
      mentor: 0.4,
      analytics: 0.4,
      default: 0.4,
    }[store.currentScene] ?? 0.4;
    const sceneScaleFactor = 1; // keep orb large on all scenes === 'landing' ? 0.6 : 0.9;

    // Orb breathing and pulsing (Level 3)
    const breathe = 1.0 + Math.sin(time * 1.6) * 0.08;
    const finalScale = targetScale * breathe * sceneScaleFactor;
    const scaleLerp = THREE.MathUtils.lerp(coreRef.current.scale.x, finalScale, 0.08);
    coreRef.current.scale.set(scaleLerp, scaleLerp, scaleLerp);

    const glowScale = scaleLerp * (1.05 + Math.sin(time * 2.5) * 0.03);
    glowRef.current.scale.set(glowScale, glowScale, glowScale);

    // Apply opacity to core material
    const material = coreRef.current.material as any;
    if (material) {
      material.distort = 0.35 + Math.sin(time * 0.8) * 0.12;
      material.speed = 1.8 + Math.cos(time * 0.5) * 0.6;
      material.opacity = sceneOpacity;
    }

    // Spin core
    coreRef.current.rotation.y = time * store.rotationSpeed;
    coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.12;
    glowRef.current.rotation.y = -time * 0.08;

    // Update uniform colors dynamically
    if (glowMaterialRef.current) {
      glowMaterialRef.current.uniforms.uColor.value.set(store.glowColor);
    }
  });

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(store.glowColor) }
  }), []);

  return (
    <group>
      {/* Central sphere with dynamic physical metal distortion */}
      {/* Adjust opacity and size based on current scene */}
      <Sphere ref={coreRef} args={[1.0, 96, 96]}>
        <MeshDistortMaterial
          color={store.glowColor}
          emissive={store.glowColor}
          emissiveIntensity={0.65}
          distort={0.4}
          speed={2.2}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.95}
        />
      </Sphere>
      
      {/* Outer shader glowing aura mesh */}
      <Sphere ref={glowRef} args={[1.05, 64, 64]}>
        <shaderMaterial
          ref={glowMaterialRef}
          vertexShader={RimGlowShader.vertexShader}
          fragmentShader={RimGlowShader.fragmentShader}
          uniforms={uniforms}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}

function GlobalNeuralBackground() {
  const store = useSceneStore();
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;
  
  const [particles, pointsArray] = useMemo(() => {
    const pts = [];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 10;
      pts.push({ x, y, z, phase: Math.random() * 10, speed: 0.15 + Math.random() * 0.2 });
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return [pts, arr];
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = pointsRef.current?.geometry.attributes.position;
    if (!pos || !pointsRef.current) return;
    
    // Slow drift drift particles in background
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const yShift = Math.sin(time * p.speed + p.phase) * 0.005;
      const xShift = Math.cos(time * p.speed + p.phase) * 0.004;
      pos.setXYZ(i, pos.getX(i) + xShift, pos.getY(i) + yShift, pos.getZ(i));
    }
    pos.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.008;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointsArray, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={store.glowColor}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={store.particlesIntensity * 0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-[#030014] overflow-hidden" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[8, 8, 8]} intensity={2.2} color="#c084fc" />
          <pointLight position={[-8, -6, 4]} intensity={1.6} color="#38bdf8" />
          <pointLight position={[0, -2, -6]} intensity={1.2} color="#ec4899" />
          <Stars radius={60} depth={40} count={900} factor={2} saturation={0.5} fade speed={0.4} />
          <CameraController />
          <GlobalNeuralBackground />
          <FloatingAICore />
        </Suspense>
      </Canvas>
    </div>
  );
}
