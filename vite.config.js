import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
    server: {
        port: 5000,
        open: true, // opens the app in the browser on start
        watch: {
            usePolling: true
        }
    },
    resolve: {
        alias: {
            // Maps '@' directly to your local 'src' directory
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
