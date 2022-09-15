module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts'
    }
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          auto: () => true
        }
      },
      scss: {
        prependData: '@import "@/assets/_variables.scss";'
      }
    }
  }
}
