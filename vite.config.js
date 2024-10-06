import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { dependencies } from './package.json'

function renderChunks(deps) {
  const chunks = {}
  Object.keys(deps).forEach((key) => {
    if (!['react', 'react-router-dom', 'react-dom'].includes(key)) {
      chunks[key] = [key]
    }
  })
  return chunks
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@services': path.resolve(__dirname, './src/services')
      }
    },

    plugins: [
      react({
        jsxRuntime: 'automatic',
        plugins: [['@swc/plugin-emotion', {}]]
      }),

      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        filter: /\.(js|css|html|svg)$/i,
        threshold: 10240
      }),

      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            description: env.VITE_APP_DESCRIPTION
          }
        },
        minify: true
      }),

      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],

    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            ...renderChunks(dependencies)
          }
        }
      }
    },

    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block'
      }
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@firebase/app']
    }
  }
})
