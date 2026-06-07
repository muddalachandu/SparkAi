import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSceneStore } from "@/hooks/use-scene-store";

// Detect touch/mobile devices — custom cursor should not render on them
function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

export function CustomCursor() {
  const store = useSceneStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Don't render at all on touch/mobile devices
  const [isTouch] = useState(() => isTouchDevice());

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 280, damping: 24, mass: 0.4 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const trail1X = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.3 });
  const trail1Y = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.3 });

  const trail2X = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.25 });
  const trail2Y = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.25 });

  const trail3X = useSpring(mouseX, { stiffness: 70, damping: 14, mass: 0.2 });
  const trail3Y = useSpring(mouseY, { stiffness: 70, damping: 14, mass: 0.2 });

  useEffect(() => {
    // On touch devices skip injecting cursor:none and don't listen to mouse events
    if (isTouch) return;

    const style = document.createElement("style");
    style.innerHTML = `
      * { cursor: none !important; }
      a, button, [role="button"], input, select, textarea, [data-interactive] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const checkHover =
          target.closest("a") ||
          target.closest("button") ||
          target.closest("[role='button']") ||
          target.closest(".interactive-3d-node");
        setIsHovered(!!checkHover);
      }
    };

    const handleLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [isVisible, isTouch]);

  // Never render on touch devices
  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Energy trail particles */}
      <motion.div
        style={{
          x: trail3X,
          y: trail3Y,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: store.glowColor,
          opacity: 0.2,
          scale: isHovered ? 1.6 : 1.2,
        }}
        className="absolute h-4 w-4 rounded-full blur-[2px] pointer-events-none"
      />
      <motion.div
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: store.glowColor,
          opacity: 0.35,
          scale: isHovered ? 1.2 : 0.8,
        }}
        className="absolute h-3 w-3 rounded-full blur-[1px] pointer-events-none"
      />
      <motion.div
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: store.glowColor,
          opacity: 0.55,
          scale: isHovered ? 0.8 : 0.5,
        }}
        className="absolute h-2 w-2 rounded-full blur-[0.5px] pointer-events-none"
      />
      {/* Dynamic trailing halo */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: store.glowColor,
          boxShadow: `0 0 20px ${store.glowColor}50, inset 0 0 10px ${store.glowColor}20`,
          scale: isHovered ? 1.6 : 1.0,
        }}
        className="absolute h-9 w-9 rounded-full border border-white/20 bg-white/5 opacity-80 backdrop-blur-[1px] transition-all duration-300 ease-out"
      />
      {/* Responsive center dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: store.glowColor,
          scale: isHovered ? 0.5 : 1.0,
        }}
        className="absolute h-1.5 w-1.5 rounded-full transition-colors duration-500"
      />
    </div>
  );
}
export default CustomCursor;
