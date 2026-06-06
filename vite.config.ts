// vite.config.ts
import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,   // keep the higher threshold
    rollupOptions: {
      output: {
        // Split external libraries into their own async chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Example: keep Recharts in its own file
            if (id.includes('recharts')) return 'recharts';
            // Keep the TanStack router/lib in a separate chunk
            if (id.includes('@tanstack/router-core')) return 'tanstack-router';
            // Everything else goes to a generic vendor chunk
            return 'vendor';
          }
        },
      },
    },
  },
});
