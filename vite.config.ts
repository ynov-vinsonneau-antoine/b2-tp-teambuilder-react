import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    // "@/store/team" plutôt que "../../store/team" : l'import ne dépend plus
    // de l'endroit d'où on l'écrit.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
