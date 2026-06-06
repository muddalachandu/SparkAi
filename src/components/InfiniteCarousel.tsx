import { motion } from "framer-motion";
import { playHover } from "@/lib/sounds";

const TECHS = [
  { name: "React", color: "text-[#61dafb]" },
  { name: "Next.js", color: "text-white" },
  { name: "TypeScript", color: "text-[#3178c6]" },
  { name: "Three.js", color: "text-[#ec4899]" },
  { name: "Supabase", color: "text-[#3ecf8e]" },
  { name: "Gemini AI", color: "text-[#8b5cf6]" },
  { name: "Framer Motion", color: "text-[#c084fc]" },
  { name: "Python", color: "text-[#3776ab]" },
  { name: "Docker", color: "text-[#2496ed]" },
  { name: "Tailwind CSS", color: "text-[#38bdf8]" },
  { name: "Rust", color: "text-[#dea584]" },
  { name: "Go Lang", color: "text-[#00add8]" },
  { name: "ATS Analyzer", color: "text-[#f59e0b]" },
  { name: "AI Mentor", color: "text-[#10b981]" }
];

export function InfiniteCarousel() {
  const doubleTechs = [...TECHS, ...TECHS];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-black/25 py-3.5 backdrop-blur-md">
      {/* Edge vignettes */}
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#030014] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#030014] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-8 whitespace-nowrap min-w-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
      >
        {doubleTechs.map((tech, idx) => (
          <div
            key={idx}
            onMouseEnter={playHover}
            className="flex items-center gap-2 rounded-full border border-white/5 bg-white/2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur transition hover:border-white/10 hover:bg-white/5 select-none cursor-pointer"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark animate-pulse" />
            <span className={tech.color}>{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default InfiniteCarousel;
