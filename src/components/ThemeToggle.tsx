import React, { useEffect, useState } from "react";
import { MotionButton } from "./MotionButton";
import { Sun, Moon } from "lucide-react";

/**
 * Theme toggle switch that flips between dark (default) and light modes.
 * Persists user choice in localStorage and applies a "light" data attribute to the <html> element.
 */
export const ThemeToggle: React.FC = () => {
  const [isLight, setIsLight] = useState(false);

  // Initialise theme from localStorage or system preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialLight = saved === "light" || (!saved && !prefersDark);
    setIsLight(initialLight);
    document.documentElement.classList.toggle("light", initialLight);
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <MotionButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors"
    >
      {isLight ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {isLight ? "Light" : "Dark"}
    </MotionButton>
  );
};
