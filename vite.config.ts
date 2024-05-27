import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: mode === 'development'
      ? {
        '^/(api)|(dynamics)/.*': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
      : undefined
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}))
