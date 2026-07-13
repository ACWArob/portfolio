import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' keeps asset paths relative so the build works on any host
// (AWS S3/CloudFront, Netlify, a subfolder) and even opens via file://.
// viteSingleFile inlines JS+CSS into one index.html for a portable build.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
