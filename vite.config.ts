// vite.config.ts
import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  // Keep the original TanStack preset – it knows about the `src/` entry, SSR, etc.
  // Only customize the chunk‑size warning limit.
  build: {
    // Raise the warning threshold – default is 500 KB
    chunkSizeWarningLimit: 1500, // 1.5 MB, adjust as you see fit
  },
});
