import { useRef, useState, useEffect } from "react";
import type { StudyGuide } from "@/lib/schemas";
import { Check, Bookmark, GraduationCap, ChevronLeft, ChevronRight, RotateCw, ArrowRight } from "lucide-react";

interface Props {
  guide: StudyGuide;
  completed: Record<string, boolean>;
  onToggleComplete: (key: string) => void;
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (key: string) => void;
}

export function StudyGuideUniverse({
  guide,
  completed,
  onToggleComplete,
  bookmarks,
  onToggleBookmark,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [warpFactor, setWarpFactor] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Total weeks
  const total = guide.weeks.length;

  // Handle active index changes with warp acceleration
  const handleIndexChange = (newIndex: number) => {
    setActiveIndex(newIndex);
    setFlipped(false);
    // Trigger warp speed effect in particle background
    setWarpFactor(5);
  };

  // Decay warp factor back to normal
  useEffect(() => {
    if (warpFactor > 1) {
      const timer = setTimeout(() => {
        setWarpFactor(prev => Math.max(1, prev - 0.25));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [warpFactor]);

  // Particle System & AI Core Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle structure
    interface Particle {
      radius: number;      // Orbit radius
      angle: number;       // Current angle in radians
      speed: number;       // Rotation speed
      size: number;        // Render size
      color: string;       // Color string
      pulsePhase: number;  // Pulsing phase
      type: "star" | "cube" | "polygon";
    }

    const particles: Particle[] = [];
    const particleCount = 120;
    const colors = [
      "rgba(236, 72, 153, 0.65)", // Pink
      "rgba(168, 85, 247, 0.65)", // Purple
      "rgba(59, 130, 246, 0.65)", // Blue
      "rgba(34, 211, 238, 0.65)", // Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        radius: Math.random() * (width * 0.45) + 60,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        type: Math.random() > 0.75 ? (Math.random() > 0.5 ? "cube" : "polygon") : "star",
      });
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      const cx = width / 2;
      const cy = height * 0.46; // Shift center slightly up to align with 3D carousel

      // 1. Draw volumetric background grid and glow
      const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.65);
      bgGlow.addColorStop(0, "rgba(22, 12, 50, 0.45)");
      bgGlow.addColorStop(0.5, "rgba(10, 5, 28, 0.2)");
      bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Breathing AI Core Volumetric Energy Sphere
      const breathing = Math.sin(time * 2.2) * 6;
      const coreRadius = 70 + breathing;

      // Volumetric aura gradient
      const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 1.85);
      auraGrad.addColorStop(0, "rgba(236, 72, 153, 0.4)");
      auraGrad.addColorStop(0.35, "rgba(168, 85, 247, 0.22)");
      auraGrad.addColorStop(0.65, "rgba(59, 130, 246, 0.08)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.85, 0, Math.PI * 2);
      ctx.fill();

      // Solid central core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.25, "rgba(236, 72, 153, 0.9)");
      coreGrad.addColorStop(0.65, "rgba(124, 58, 237, 0.72)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Orbital Rings (Holographic HUD elements rotating)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(34, 211, 238, 0.22)";
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      // Dotted rotating ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.25);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.32)";
      ctx.setLineDash([4, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius * 1.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Counter-rotating tech segments
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.4);
      ctx.strokeStyle = "rgba(236, 72, 153, 0.35)";
      ctx.setLineDash([50, 40, 8, 40]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius * 1.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Draw Orbiting Neural Universe Particles (with squashed Y for 3D perspective)
      particles.forEach((p, index) => {
        // Accelerate when warp factor is high
        p.angle += p.speed * warpFactor;
        
        const px = cx + p.radius * Math.cos(p.angle);
        // Squashing the Y dimension creates a flat circular orbit in 3D perspective
        const py = cy + p.radius * Math.sin(p.angle) * 0.24;

        const sizeMultiplier = Math.sin(time + p.pulsePhase) * 0.28 + 0.92;
        const currentSize = p.size * sizeMultiplier;

        ctx.fillStyle = p.color;
        ctx.beginPath();

        if (p.type === "star") {
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "cube") {
          ctx.rect(px - currentSize, py - currentSize, currentSize * 2, currentSize * 2);
          ctx.fill();
        } else {
          // Polygon triangle
          ctx.moveTo(px, py - currentSize);
          ctx.lineTo(px + currentSize, py + currentSize);
          ctx.lineTo(px - currentSize, py + currentSize);
          ctx.closePath();
          ctx.fill();
        }

        // Draw connections for close particles (Neural link pulses)
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2x = cx + p2.radius * Math.cos(p2.angle);
          const p2y = cy + p2.radius * Math.sin(p2.angle) * 0.24;
          
          const dist = Math.hypot(px - p2x, py - p2y);
          if (dist < 75) {
            const alpha = (1 - dist / 75) * 0.16;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2x, p2y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [warpFactor]);

  // Card placement angle calculations
  const angleStep = 360 / total;
  // Calculate cylinder radius so cards have optimal spacing
  const radius = Math.max(340, 240 / (2 * Math.tan(Math.PI / total)));

  return (
    <div className="relative h-[650px] w-full bg-black/45 rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between p-6">
      {/* 3D background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-center bg-black/35 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-spark">Spatial Universe</span>
          <h2 className="text-base font-display font-semibold text-foreground">Week {guide.weeks[activeIndex].week}: {guide.weeks[activeIndex].focus}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleIndexChange((activeIndex - 1 + total) % total)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition active:scale-95 cursor-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center text-xs font-semibold px-2">
            {activeIndex + 1} / {total}
          </div>
          <button
            onClick={() => handleIndexChange((activeIndex + 1) % total)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition active:scale-95 cursor-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div 
        className="flex-1 w-full flex items-center justify-center relative"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 40%",
          overflow: "visible"
        }}
      >
        {/* 3D Cylinder Track */}
        <div
          className="relative flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${-activeIndex * angleStep}deg)`,
            transition: "transform 0.85s cubic-bezier(0.19, 1, 0.22, 1)",
            width: "280px",
            height: "380px"
          }}
        >
          {guide.weeks.map((week, idx) => {
            const isCurrent = activeIndex === idx;
            const cardAngle = idx * angleStep;

            return (
              <CylinderCard
                key={week.week}
                weekData={week}
                index={idx}
                cardAngle={cardAngle}
                radius={radius}
                isCurrent={isCurrent}
                flipped={flipped && isCurrent}
                setFlipped={setFlipped}
                completed={completed}
                onToggleComplete={onToggleComplete}
                bookmarks={bookmarks}
                onToggleBookmark={onToggleBookmark}
                onSelect={() => handleIndexChange(idx)}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="relative z-10 w-full flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {guide.weeks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleIndexChange(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-none ${
                activeIndex === idx ? "w-8 bg-spark" : "w-2 bg-white/10 hover:bg-white/30"
              }`}
              title={`Week ${idx + 1}`}
            />
          ))}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5">
          <GraduationCap className="h-3.5 w-3.5 text-spark" />
          <span>Click cards to rotate. Click active card to explore details.</span>
        </div>
      </div>
    </div>
  );
}

// Inner Cylinder Card Component supporting 3D Hover Parallax and Flip
function CylinderCard({
  weekData,
  index,
  cardAngle,
  radius,
  isCurrent,
  flipped,
  setFlipped,
  completed,
  onToggleComplete,
  bookmarks,
  onToggleBookmark,
  onSelect,
}: {
  weekData: any;
  index: number;
  cardAngle: number;
  radius: number;
  isCurrent: boolean;
  flipped: boolean;
  setFlipped: (f: boolean) => void;
  completed: Record<string, boolean>;
  onToggleComplete: (key: string) => void;
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (key: string) => void;
  onSelect: () => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Handle Card Hover Parallax (only for the card currently active in the front)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCurrent || flipped) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -10; // Max tilt rotation angle
    const tiltY = (x / (rect.width / 2)) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={() => {
        if (!isCurrent) onSelect();
      }}
      className={`absolute w-[280px] h-[380px] transition-opacity duration-500 select-none ${
        isCurrent ? "opacity-100 cursor-pointer" : "opacity-35 hover:opacity-75 cursor-pointer"
      }`}
      style={{
        transformStyle: "preserve-3d",
        // Position card in a circular cylinder formation
        transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) ${
          isCurrent && flipped ? "rotateY(180deg)" : ""
        }`,
        transition: "transform 0.85s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s",
        backfaceVisibility: "visible"
      }}
    >
      {/* Inner Card Wrapper with Hover Tilt Parallax */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          transform: isCurrent && !flipped ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)` : "scale(1)",
          transition: "transform 0.15s ease-out"
        }}
      >
        {/* CARD FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-card/85 p-5 backdrop-blur-xl shadow-glow flex flex-col justify-between text-foreground"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)"
          }}
        >
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-spark">Week {weekData.week}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(`week-${weekData.week}`);
                }}
                className="text-muted-foreground hover:text-spark transition p-1 cursor-none"
              >
                <Bookmark className={`h-4 w-4 ${bookmarks[`week-${weekData.week}`] ? "fill-spark text-spark" : ""}`} />
              </button>
            </div>
            
            <h3 className="mt-3 font-display text-lg font-bold text-foreground leading-snug">{weekData.focus}</h3>
            
            <div className="mt-5 space-y-2">
              <h4 className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Weekly Topics</h4>
              <ul className="space-y-1.5 text-xs">
                {(weekData.tasks || []).slice(0, 4).map((task: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-spark" />
                    <span className="line-clamp-1">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isCurrent) {
                  onSelect();
                } else {
                  setFlipped(true);
                }
              }}
              className="w-full flex justify-center items-center gap-1.5 rounded-xl bg-gradient-spark px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 cursor-none"
            >
              {isCurrent ? (
                <>Explore Topics <RotateCw className="h-3 w-3" /></>
              ) : (
                <>Select Week <ArrowRight className="h-3 w-3" /></>
              )}
            </button>
          </div>
        </div>

        {/* CARD BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-card/90 p-5 backdrop-blur-2xl shadow-glow flex flex-col justify-between text-foreground"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Week {weekData.week} Details</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                className="text-[10px] font-semibold text-spark flex items-center gap-1 hover:underline cursor-none p-1"
              >
                <RotateCw className="h-3 w-3" /> Flip Back
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-4" data-lenis-prevent="true">
              <div className="space-y-2">
                <h4 className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Tasks Checklist</h4>
                <div className="space-y-1.5">
                  {(weekData.tasks || []).map((task: string, idx: number) => {
                    const key = `week-${weekData.week}-task-${idx}`;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(key);
                        }}
                        className="flex w-full items-start gap-2.5 text-left text-xs text-muted-foreground hover:text-foreground transition py-0.5 cursor-none"
                      >
                        <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                          completed[key] ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/15 bg-white/5"
                        }`}>
                          {completed[key] && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className={`leading-normal ${completed[key] ? "line-through opacity-40 text-muted-foreground" : ""}`}>{task}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2 pt-1 border-t border-white/5">
                <h4 className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Recommended Resources</h4>
                <div className="space-y-1.5">
                  {(weekData.resources || []).map((res: string, idx: number) => (
                    <a
                      key={idx}
                      href={res.startsWith("http") ? res : `https://www.google.com/search?q=${encodeURIComponent(res)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 truncate text-xs text-spark hover:underline cursor-none"
                    >
                      <span>🔗</span>
                      <span className="truncate">{res}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground transition cursor-none"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyGuideUniverse;
