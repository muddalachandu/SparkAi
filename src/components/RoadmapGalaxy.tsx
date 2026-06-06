import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Ring, Stars, Html } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import type { RoadmapNode } from "@/lib/roadmap-catalog";

interface GalaxyProps {
  nodes: RoadmapNode[];
  completedIds: Set<string>;
  inProgressIds: Set<string>;
  selectedNode: RoadmapNode | null;
  onSelectNode: (node: RoadmapNode) => void;
  nodeStatus?: "locked" | "available" | "in_progress" | "completed";
  onStatusChange?: (newStatus: "in_progress" | "done") => void;
}

// Camera animation controller
function CameraController({ targetPosition }: { targetPosition: THREE.Vector3 | null }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const duration = 1.2;
    if (targetPosition) {
      // Calculate target camera position: offset slightly from the planet
      const targetCamX = targetPosition.x + 0.6;
      const targetCamY = targetPosition.y + 0.4;
      const targetCamZ = targetPosition.z + 1.4;

      gsap.to(camera.position, {
        x: targetCamX,
        y: targetCamY,
        z: targetCamZ,
        duration: duration,
        ease: "power2.out"
      });

      if (controls) {
        const orbitControls = controls as any;
        gsap.to(orbitControls.target, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            orbitControls.update();
          }
        });
      }
    } else {
      // Reset camera to default view
      gsap.to(camera.position, {
        x: 0,
        y: 2.5,
        z: 6,
        duration: duration,
        ease: "power2.out"
      });

      if (controls) {
        const orbitControls = controls as any;
        gsap.to(orbitControls.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            orbitControls.update();
          }
        });
      }
    }
  }, [targetPosition, camera, controls]);

  return null;
}

function PlanetRing({ radius, color }: { radius: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });
  return (
    <Ring ref={ref} args={[radius, radius + 0.12, 64]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.35} />
    </Ring>
  );
}

function NodePlanet({
  node,
  index,
  total,
  status,
  isSelected,
  onClick,
}: {
  node: RoadmapNode;
  index: number;
  total: number;
  status: "locked" | "available" | "in_progress" | "completed";
  isSelected: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position on a helical galaxy spiral
  const pos = useMemo(() => {
    const angle = index * (Math.PI / 2.2);
    const radius = 1.3 + index * 0.7;
    const y = (index - total / 2) * 0.35;
    return new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
  }, [index, total]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.0 + index) * 0.04;
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  const colorConfig = useMemo(() => {
    switch (status) {
      case "completed":
        return { color: "#10b981", emissive: "#059669", intensity: 1.5, ring: true };
      case "in_progress":
        return { color: "#c084fc", emissive: "#6b21a8", intensity: 1.0, ring: true };
      case "available":
        return { color: "#38bdf8", emissive: "#0369a1", intensity: 0.8, ring: false };
      default:
        return { color: "#4b5563", emissive: "#1f2937", intensity: 0.15, ring: false };
    }
  }, [status]);

  return (
    <group position={pos}>
      <Sphere
        ref={ref}
        args={[0.36, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
      >
        <meshPhysicalMaterial
          color={colorConfig.color}
          emissive={colorConfig.emissive}
          emissiveIntensity={colorConfig.intensity}
          roughness={hovered ? 0.05 : 0.2}
          metalness={0.8}
          clearcoat={1.0}
        />
      </Sphere>

      {/* Orbit/Completeness ring */}
      {colorConfig.ring && <PlanetRing radius={0.52} color={colorConfig.color} />}

      {/* Halo glow selection effect */}
      {isSelected && (
        <Sphere args={[0.45, 16, 16]}>
          <meshBasicMaterial
            color={colorConfig.color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            wireframe
          />
        </Sphere>
      )}

      {/* Bounding lock cage wireframe */}
      {status === "locked" && (
        <mesh rotation={[0.5, 0.5, 0.5]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.12} />
        </mesh>
      )}

      {/* Planet node name text label */}
      <Html distanceFactor={8} position={[0, 0.55, 0]} center>
        <div
          className={`pointer-events-none select-none rounded-md px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border backdrop-blur transition-all duration-300 ${
            isSelected
              ? "bg-spark/90 text-primary-foreground border-spark"
              : hovered
                ? "bg-card/90 text-foreground border-white/20 scale-105"
                : "bg-black/60 text-muted-foreground border-white/5"
          }`}
        >
          {node.title}
        </div>
      </Html>
    </group>
  );
}

function ConnectionBeams({ nodes, total }: { nodes: RoadmapNode[]; total: number }) {
  const points = useMemo(() => {
    return nodes.map((_, index) => {
      const angle = index * (Math.PI / 2.2);
      const radius = 1.3 + index * 0.7;
      const y = (index - total / 2) * 0.35;
      return new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
    });
  }, [nodes, total]);

  const curvePoints = useMemo(() => {
    if (points.length < 2) return [];
    const beams = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      // Create a nice arched beam
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 0.25; // bend upward
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      beams.push(curve.getPoints(30));
    }
    return beams;
  }, [points]);

  return (
    <group>
      {curvePoints.map((pts, i) => {
        const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: "#818cf8",
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
          linewidth: 2,
        });
        const lineObj = new THREE.Line(lineGeom, lineMat);
        return <primitive key={i} object={lineObj} />;
      })}
    </group>
  );
}

export function RoadmapGalaxy({
  nodes,
  completedIds,
  inProgressIds,
  selectedNode,
  onSelectNode,
  nodeStatus,
  onStatusChange,
}: GalaxyProps) {
  const total = nodes.length;

  // Compute 3D coordinate of the selected node
  const selectedPos = useMemo(() => {
    if (!selectedNode) return null;
    const idx = nodes.findIndex((n) => n.id === selectedNode.id);
    if (idx === -1) return null;
    const angle = idx * (Math.PI / 2.2);
    const radius = 1.3 + idx * 0.7;
    const y = (idx - total / 2) * 0.35;
    return new THREE.Vector3(radius * Math.cos(angle), y - 0.3, radius * Math.sin(angle));
  }, [selectedNode, nodes, total]);

  // Thematic lighting shift based on selected topic title
  const themeColors = useMemo(() => {
    if (!selectedNode) {
      return { ambient: "#c084fc", point1: "#38bdf8", point2: "#ec4899" };
    }
    const title = selectedNode.title.toLowerCase();
    if (
      title.includes("react") ||
      title.includes("html") ||
      title.includes("css") ||
      title.includes("frontend") ||
      title.includes("javascript") ||
      title.includes("ui")
    ) {
      return { ambient: "#06b6d4", point1: "#00d2ff", point2: "#3b82f6" };
    } else if (
      title.includes("sql") ||
      title.includes("db") ||
      title.includes("backend") ||
      title.includes("node") ||
      title.includes("python") ||
      title.includes("rust") ||
      title.includes("go")
    ) {
      return { ambient: "#10b981", point1: "#10b981", point2: "#14b8a6" };
    } else if (
      title.includes("ai") ||
      title.includes("learning") ||
      title.includes("model") ||
      title.includes("prompt") ||
      title.includes("agent")
    ) {
      return { ambient: "#a78bfa", point1: "#c084fc", point2: "#f472b6" };
    } else {
      return { ambient: "#fb923c", point1: "#f43f5e", point2: "#e11d48" };
    }
  }, [selectedNode]);

  // Topic status badge styling
  const statusTheme = useMemo(() => {
    if (!nodeStatus) return { label: "Locked", badgeBg: "bg-red-500/10", badgeText: "text-red-400" };
    switch (nodeStatus) {
      case "completed":
        return { label: "Completed", badgeBg: "bg-emerald-500/15", badgeText: "text-emerald-400" };
      case "in_progress":
        return { label: "In Progress", badgeBg: "bg-purple-500/15", badgeText: "text-purple-400" };
      case "available":
        return { label: "Available", badgeBg: "bg-sky-500/15", badgeText: "text-sky-400" };
      default:
        return { label: "Locked", badgeBg: "bg-red-500/10", badgeText: "text-red-400" };
    }
  }, [nodeStatus]);

  return (
    <div className="relative h-full w-full bg-black/45 rounded-3xl border border-white/5 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2.5, 6], fov: 40 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} color={themeColors.ambient} />
          <pointLight position={[10, 10, 10]} intensity={1.8} color={themeColors.point1} />
          <pointLight position={[-10, -10, -10]} intensity={1.0} color={themeColors.point2} />
          <Stars radius={40} depth={20} count={350} factor={1.5} saturation={0.5} fade speed={0.5} />
          
          <group position={[0, -0.3, 0]}>
            <ConnectionBeams nodes={nodes} total={total} />
            
            {nodes.map((node, index) => {
              const isCompleted = completedIds.has(node.id);
              const isInProgress = inProgressIds.has(node.id);
              const isSelected = selectedNode?.id === node.id;
              
              // Status matching: All other nodes are available by default (no locks)
              let status: "locked" | "available" | "in_progress" | "completed" = "locked";
              if (isCompleted) {
                status = "completed";
              } else if (isInProgress) {
                status = "in_progress";
              } else {
                status = "available";
              }

              return (
                <NodePlanet
                  key={node.id}
                  node={node}
                  index={index}
                  total={total}
                  status={status}
                  isSelected={isSelected}
                  onClick={() => onSelectNode(node)}
                />
              );
            })}
          </group>

          <CameraController targetPosition={selectedPos} />
          <OrbitControls
            enableZoom={true}
            maxDistance={12}
            minDistance={3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D Info Overlay */}
      {selectedNode && (
        <div className="absolute left-4 top-4 bottom-4 w-76 glass-panel rounded-3xl p-5 z-20 overflow-y-auto flex flex-col justify-between select-none animate-page-entry">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                statusTheme.badgeBg
              } ${statusTheme.badgeText}`}>
                {statusTheme.label}
              </span>
              <button 
                onClick={() => onSelectNode(null as any)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div>
              <h3 className="text-base font-bold text-foreground font-display leading-tight">{selectedNode.title}</h3>
              <p className="mt-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {selectedNode.difficulty} • {selectedNode.hours} Hours
              </p>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-spark">Why to learn</span>
                <p className="mt-0.5 text-muted-foreground">{selectedNode.why}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-aurora">Expected Outcome</span>
                <p className="mt-0.5 text-muted-foreground">{selectedNode.outcome}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {nodeStatus !== "locked" ? (
              <button
                onClick={() => onStatusChange && onStatusChange(nodeStatus === "completed" ? "in_progress" : "done")}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition ${
                  nodeStatus === "completed" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" 
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25"
                }`}
              >
                {nodeStatus === "completed" ? "Mark as In Progress" : "Mark Completed"}
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-[10px] text-red-400 leading-normal">
                <span>⚠️ Finish preceding topics sequentially to unlock this planet.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend overlay */}
      {!selectedNode && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex gap-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-black/55 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" /> Completed</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#c084fc]" /> In Progress</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /> Available</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#4b5563]" /> Locked</div>
        </div>
      )}
    </div>
  );
}
export default RoadmapGalaxy;
