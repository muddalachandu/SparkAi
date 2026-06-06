import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Ring, Stars, Html } from "@react-three/drei";
import { useRef, useMemo, useState, Suspense } from "react";
import * as THREE from "three";
import { Activity, Target, Zap, Trophy } from "lucide-react";

interface SkillItem {
  skill: string;
  value: number;
}

interface AnalyticsUniverseProps {
  learningHours: number;
  learningTarget: number;
  projectsCount: number;
  projectsTarget: number;
  aiInteractions: number;
  aiTarget: number;
  skills: SkillItem[];
}

function ConcentricRing({
  innerRadius,
  outerRadius,
  progress, // 0 to 1
  color,
  label,
  valueText,
  icon: Icon,
  index,
}: {
  innerRadius: number;
  outerRadius: number;
  progress: number;
  color: string;
  label: string;
  valueText: string;
  icon: any;
  index: number;
}) {
  const bgRef = useRef<THREE.Mesh>(null);
  const fgRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const thetaLength = useMemo(() => {
    return Math.max(0.01, Math.min(0.999, progress)) * Math.PI * 2;
  }, [progress]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (fgRef.current && bgRef.current) {
      // Gentle floating tilt
      const tilt = Math.sin(time * 0.8 + index) * 0.05;
      fgRef.current.rotation.x = -Math.PI / 2 + tilt;
      bgRef.current.rotation.x = -Math.PI / 2 + tilt;
      
      // Scale pulse on hover
      const scale = hovered ? 1.03 : 1.0;
      fgRef.current.scale.set(scale, scale, scale);
      bgRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Background ring (dimmed) */}
      <Ring
        ref={bgRef}
        args={[innerRadius, outerRadius, 64]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Progress ring overlay */}
      <Ring
        ref={fgRef}
        args={[innerRadius, outerRadius, 64, 1, 0, thetaLength]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          roughness={0.2}
          metalness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </Ring>

      {/* Tooltip on Hover */}
      {hovered && (
        <Html
          position={[0, 0, (innerRadius + outerRadius) / 2]}
          distanceFactor={6}
          center
        >
          <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/85 px-3 py-2 text-foreground backdrop-blur-xl shadow-glow select-none pointer-events-none min-w-[120px]">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
              <Icon className="h-3 w-3" style={{ color }} />
              {label}
            </div>
            <div className="text-sm font-bold" style={{ color }}>{valueText}</div>
            <div className="text-[9px] text-muted-foreground">{Math.round(progress * 100)}% of goal</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function SkillNode({
  skill,
  value,
  index,
  total,
}: {
  skill: string;
  value: number;
  index: number;
  total: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  const [hovered, setHovered] = useState(false);

  // Position skills in a 3D circle branching from center
  const pos = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    const r = 2.4;
    const y = Math.sin(index * 1.5) * 0.4;
    return new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle));
  }, [index, total]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      // Spinning + hovering
      meshRef.current.position.y = pos.y + Math.sin(time * 1.5 + index) * 0.08;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.x = time * 0.2;
      
      const pulse = (hovered ? 1.25 : 1.0) + Math.sin(time * 3.0 + index) * 0.04;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Line linking node to center
  const lineGeom = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), pos];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [pos]);

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: hovered ? "#22d3ee" : "#475569",
      transparent: true,
      opacity: hovered ? 0.8 : 0.25,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });
  }, [hovered]);

  const lineObj = useMemo(() => {
    return new THREE.Line(lineGeom, lineMat);
  }, [lineGeom, lineMat]);

  return (
    <group>
      {/* Connector to center */}
      <primitive object={lineObj} />

      {/* Floating skill planet */}
      <group position={pos}>
        <Sphere
          ref={meshRef}
          args={[0.22, 16, 16]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhysicalMaterial
            color={hovered ? "#22d3ee" : "#334155"}
            emissive={hovered ? "#0891b2" : "#1e293b"}
            emissiveIntensity={hovered ? 1.6 : 0.3}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1.0}
            wireframe={!hovered}
          />
        </Sphere>

        {/* Skill label */}
        <Html distanceFactor={6} position={[0, 0.4, 0]} center>
          <div
            className={`pointer-events-none select-none rounded-md px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest border backdrop-blur transition-all duration-300 ${
              hovered
                ? "bg-cyan-500/90 text-black border-cyan-400 scale-105 shadow-glow"
                : "bg-black/60 text-muted-foreground border-white/5"
            }`}
          >
            {skill} ({value}%)
          </div>
        </Html>
      </group>
    </group>
  );
}

export function AnalyticsUniverse({
  learningHours,
  learningTarget,
  projectsCount,
  projectsTarget,
  aiInteractions,
  aiTarget,
  skills,
}: AnalyticsUniverseProps) {
  return (
    <div className="relative h-[360px] w-full bg-black/45 rounded-3xl border border-white/5 overflow-hidden">
      <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#c084fc" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />
          <Stars radius={50} depth={20} count={300} factor={1.5} saturation={0.5} fade speed={0.4} />

          <group position={[0, -0.3, 0]}>
            {/* Concentric rings in center */}
            <ConcentricRing
              innerRadius={1.3}
              outerRadius={1.42}
              progress={learningHours / learningTarget}
              color="#38bdf8"
              label="Learning Hours"
              valueText={`${learningHours}h / ${learningTarget}h`}
              icon={Activity}
              index={0}
            />

            <ConcentricRing
              innerRadius={1.05}
              outerRadius={1.17}
              progress={projectsCount / projectsTarget}
              color="#c084fc"
              label="Projects Created"
              valueText={`${projectsCount} / ${projectsTarget}`}
              icon={Target}
              index={1}
            />

            <ConcentricRing
              innerRadius={0.8}
              outerRadius={0.92}
              progress={aiInteractions / aiTarget}
              color="#ec4899"
              label="AI Interactions"
              valueText={`${aiInteractions} / ${aiTarget}`}
              icon={Zap}
              index={2}
            />

            {/* Central glowing core node representing Mastery */}
            <Sphere args={[0.3, 32, 32]}>
              <meshPhysicalMaterial
                color="#a78bfa"
                emissive="#7c3aed"
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.9}
                clearcoat={1.0}
              />
            </Sphere>

            {/* Interactive floating skill tree constellation */}
            {skills.map((s, idx) => (
              <SkillNode
                key={s.skill}
                skill={s.skill}
                value={s.value}
                index={idx}
                total={skills.length}
              />
            ))}
          </group>

          <OrbitControls
            enableZoom={true}
            maxDistance={8}
            minDistance={3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>

      {/* Info Overlay */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold bg-black/55 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5 flex gap-3">
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#38bdf8]" /> Hours</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#c084fc]" /> Projects</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#ec4899]" /> AI</div>
        <div className="flex items-center gap-1"><Trophy className="h-3 w-3 text-cyan-400" /> Hover Skills</div>
      </div>
    </div>
  );
}

export default AnalyticsUniverse;
