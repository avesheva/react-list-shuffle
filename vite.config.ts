import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.tsx'),
      name: 'react-list-shuffle',
      fileName: format => `react-list-shuffle.${ format }.js`,
    },
    rollupOptions: {
      external: ['React'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },

  plugins: [react()],
})
