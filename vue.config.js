module.exports = {
  pages: {
    'index': {
      entry: './src/pages/Home/main.js',
      template: 'public/index.html',
      title: 'Home',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
    'builder': {
      entry: './src/pages/Builder/main.js',
      template: 'public/index.html',
      title: 'Builder',
      chunks: [ 'chunk-vendors', 'chunk-common', 'builder' ]
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
