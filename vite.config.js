export default {
  base: './',
  root: './',
  build: {
    outDir: './dist'
  },
  server: {
    open: true
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
}