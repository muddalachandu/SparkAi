import { useState, useEffect, useCallback } from "react";

export type SceneMode = "landing" | "dashboard" | "roadmap" | "study-guide" | "chat" | "mentor" | "analytics" | "default";

export interface SceneState {
  currentScene: SceneMode;
  cameraPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  particlesIntensity: number;
  glowColor: string;
  isTransitioning: boolean;
  coreScale: number;
  rotationSpeed: number;
}

let state: SceneState = {
  currentScene: "default",
  cameraPosition: [0, 0, 8],
  cameraLookAt: [0, 0, 0],
  particlesIntensity: 0.5,
  glowColor: "#a78bfa",
  isTransitioning: false,
  coreScale: 1.0,
  rotationSpeed: 0.1,
};

const listeners = new Set<(s: SceneState) => void>();

export const sceneStore = {
  getState() {
    return state;
  },
  setState(updates: Partial<SceneState>) {
    state = { ...state, ...updates };
    listeners.forEach((l) => l(state));
  },
  subscribe(listener: (s: SceneState) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setScene(scene: SceneMode) {
    if (state.currentScene === scene) return;
    const config: Partial<SceneState> = { currentScene: scene };
    
    switch (scene) {
      case "landing":
        config.cameraPosition = [0, 0, 4.0];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#c084fc";
        config.particlesIntensity = 1.0;
        config.coreScale = 1.25;
        config.rotationSpeed = 0.15;
        break;
      case "dashboard":
        config.cameraPosition = [-2.5, 1.2, 4.0];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#38bdf8";
        config.particlesIntensity = 0.45;
        config.coreScale = 0.85;
        config.rotationSpeed = 0.08;
        break;
      case "roadmap":
        config.cameraPosition = [0, 3.8, 5.0];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#818cf8";
        config.particlesIntensity = 0.6;
        config.coreScale = 0.95;
        config.rotationSpeed = 0.05;
        break;
      case "study-guide":
        config.cameraPosition = [2.2, -0.8, 4.8];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#34d399";
        config.particlesIntensity = 0.5;
        config.coreScale = 0.9;
        config.rotationSpeed = 0.07;
        break;
      case "chat":
        config.cameraPosition = [2.5, 0.2, 3.8];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#a78bfa";
        config.particlesIntensity = 0.85;
        config.coreScale = 1.15;
        config.rotationSpeed = 0.22;
        break;
      case "mentor":
        config.cameraPosition = [-2.2, 0.7, 3.8];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#ec4899";
        config.particlesIntensity = 0.75;
        config.coreScale = 1.0;
        config.rotationSpeed = 0.18;
        break;
      case "analytics":
        config.cameraPosition = [0, 0.4, 5.5];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#06b6d4";
        config.particlesIntensity = 1.2;
        config.coreScale = 0.7;
        config.rotationSpeed = 0.03;
        break;
      default:
        config.cameraPosition = [0, 0, 8];
        config.cameraLookAt = [0, 0, 0];
        config.glowColor = "#a78bfa";
        config.particlesIntensity = 0.5;
        config.coreScale = 1.0;
        config.rotationSpeed = 0.1;
    }
    
    this.setState(config);
  }
};

export function useSceneStore() {
  const [current, setCurrent] = useState<SceneState>(state);
  
  useEffect(() => {
    return sceneStore.subscribe((s) => {
      setCurrent(s);
    });
  }, []);
  
  const setScene = useCallback((scene: SceneMode) => {
    sceneStore.setScene(scene);
  }, []);

  const setCamera = useCallback((pos: [number, number, number], lookAt?: [number, number, number]) => {
    sceneStore.setState({
      cameraPosition: pos,
      cameraLookAt: lookAt ?? state.cameraLookAt,
    });
  }, []);

  const setState = useCallback((updates: Partial<SceneState>) => {
    sceneStore.setState(updates);
  }, []);

  return {
    ...current,
    setScene,
    setCamera,
    setState,
  };
}
