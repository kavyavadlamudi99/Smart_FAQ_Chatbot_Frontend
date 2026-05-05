import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isWidget = mode === 'widget'

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    ...(isWidget && {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/widget.jsx'),
          name: 'SmartFAQChatbot',
          fileName: 'chatbot-widget',
          formats: ['iife']
        },
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
            // Bundle React into the widget so it works standalone
            globals: {}
          }
        },
        outDir: 'dist-widget',
        emptyOutDir: true
      }
    })
  }
})
