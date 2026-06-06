import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function HolographicPanel({ children, className = "", innerClassName = "", onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse coordinates relative to card center normalized from -0.5 to 0.5
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);
  
  // Smooth out coordinate tracking
  const springConfig = { stiffness: 180, damping: 20, mass: 0.5 };
  const rotateXSpring = useSpring(rotateXVal, springConfig);
  const rotateYSpring = useSpring(rotateYVal, springConfig);
  
  // Map coordinates to degrees of rotation
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-10, 10]);
  
  // Highlight overlay positions
  const highlightXVal = useMotionValue(-100);
  const highlightYVal = useMotionValue(-100);
  const highlightX = useSpring(highlightXVal, springConfig);
  const highlightY = useSpring(highlightYVal, springConfig);
  
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    
    // Normalized position inside the card
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    rotateXVal.set(y);
    rotateYVal.set(x);
    
    highlightXVal.set((e.clientX - rect.left));
    highlightYVal.set((e.clientY - rect.top));
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    rotateXVal.set(0);
    rotateYVal.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        z: isHovered ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
      className={`glass relative overflow-hidden rounded-3xl transition-colors duration-300 ${isHovered ? "bg-card/75 border-white/20" : "bg-card/45 border-white/10"} ${className}`}
    >
      {/* Gloss reflection overlay that moves in sync with cursor */}
      <motion.div
        style={{
          left: highlightX,
          top: highlightY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none absolute -z-10 h-64 w-64 rounded-full bg-gradient-radial from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        animate={{
          opacity: isHovered ? 1.0 : 0.0,
        }}
      />
      
      {/* Border running light highlight */}
      <div 
        className="absolute inset-0 -z-20 pointer-events-none rounded-3xl"
        style={{
          background: isHovered 
            ? "radial-gradient(110% 75% at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)" 
            : "radial-gradient(100% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          transition: "background 0.5s ease"
        }}
      />
      
      {/* Preserves 3D depth layers for card children */}
      <div 
        className={innerClassName}
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
export default HolographicPanel;
