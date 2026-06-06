import { motion, MotionProps } from "framer-motion";
import React from "react";

type OverlapKeys = keyof React.ButtonHTMLAttributes<HTMLButtonElement>;

// Drag event handlers have different signatures between React button props and Framer Motion props.
// We omit them from the native button attributes so the resulting type matches HTMLMotionProps.
type ConflictingButtonKeys =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragCancel"
  | "onAnimationStart"
  | "onAnimationComplete"
  | "onAnimationCancel"
  | "onAnimationEnd";

export type MotionButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingButtonKeys> &
  Omit<MotionProps, OverlapKeys | "children">;

/**
 * Reusable button component that adds subtle 3D hover and tap animations.
 * All clicks feel "magical".
 */
export const MotionButton: React.FC<MotionButtonProps> = ({ whileHover, whileTap, ...props }) => {
  const defaultHover: MotionProps["whileHover"] = {
    scale: 1.05,
    rotateX: 5,
    rotateY: 5,
    transition: { type: "spring", stiffness: 200 } as const,
  };
  const defaultTap = { scale: 0.97 };
  return (
    <motion.button
      whileHover={whileHover || defaultHover}
      whileTap={whileTap || defaultTap}
      {...props}
    />
  );
};
