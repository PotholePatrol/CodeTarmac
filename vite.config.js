import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
<<<<<<< HEAD
})

=======
  optimizeDeps: {
    include: ['chart.js', 'quill']
  },
  build: {
    rollupOptions: {
      external: ['chart.js/auto', 'quill']
    }
  }

})
>>>>>>> d1077b1e4f901870298d61b005bf997060345afe
