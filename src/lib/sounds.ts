// Web Audio API synthesizer for premium UI sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function isSoundsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("spark-sound-effects-enabled");
  return stored !== "false"; // default to true
}

export function setSoundsEnabled(enabled: boolean) {
  if (typeof window !== "undefined") {
    localStorage.setItem("spark-sound-effects-enabled", enabled ? "true" : "false");
  }
}

export function playHover() {
  if (!isSoundsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.015, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function playClick() {
  if (!isSoundsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

export function playSuccess() {
  if (!isSoundsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const playNote = (freq: number, delay: number, duration: number, volume = 0.04) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  };

  // Arpeggio chime
  playNote(523.25, 0.0, 0.25); // C5
  playNote(659.25, 0.08, 0.25); // E5
  playNote(783.99, 0.16, 0.35); // G5
  playNote(1046.50, 0.24, 0.45); // C6
}

export function playSweep() {
  if (!isSoundsEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.45);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.45);

  gain.gain.setValueAtTime(0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}

// User interaction unlocks AudioContext if browser has it suspended
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
}
