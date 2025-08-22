export default {
  base: '/whac-a-mole/',
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