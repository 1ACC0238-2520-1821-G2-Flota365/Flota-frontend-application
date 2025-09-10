module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  filenameHashing: true,

  devServer: {
    port: 8080,
    open: true,
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5047',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    }
  },

  css: {
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/css/styles.css";
        `
      }
    }
  },

  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
