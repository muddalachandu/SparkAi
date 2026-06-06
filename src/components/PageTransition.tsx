import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const key = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.985, y: 15, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.985, y: -15, filter: "blur(6px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-full flex flex-col"
      >
        <div className="flex-1">
          {children}
        </div>

        {/* Diagonal glowing futuristic scan-line sweep */}
        <motion.div
          initial={{ top: "-100%", opacity: 0 }}
          animate={{ 
            top: ["-100%", "200%"], 
            opacity: [0, 0.6, 0.6, 0] 
          }}
          transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
          className="pointer-events-none fixed left-0 right-0 h-32 bg-gradient-to-b from-transparent via-spark/20 to-transparent blur-md -skew-y-12 z-50"
        />

        {/* Holographic screen scanlines flash */}
        <motion.div
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none fixed inset-0 bg-spark/5 mix-blend-overlay z-40"
        />
      </motion.div>
    </AnimatePresence>
  );
}
