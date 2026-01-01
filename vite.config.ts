
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  // On utilise le répertoire courant comme source de fichiers publics 
  // pour que manifest.json et sw.js soient copiés dans /dist
  publicDir: '.', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      // On ignore les fichiers qui ne doivent pas être dans le bundle JS
      external: ['sw.js', 'manifest.json']
    }
  }
});
