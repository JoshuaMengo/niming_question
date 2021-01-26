const path = require('path')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
// const devServerPort = 9528 // TODO: get this variable from setting.ts
// const mockServerPort = 9529 // TODO: get this variable from setting.ts

const name = '' // TODO: get this variable from setting.ts

// const backEndServer = 'http://192.168.1.100:7001'
const backEndServer = 'http://anonymous.lodidc.cn/question/'


module.exports = {
  assetsDir: 'static',
  // publicPath: '../niming_question/',
  publicPath: process.env.NODE_ENV === 'production' ? '../niming_question/' : '',
  lintOnSave: process.env.NODE_ENV === 'false',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    // port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'mobileapp' ? {} : {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api': {
      // '/api': {
        target: backEndServer,
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          '^/api': ''
        }
      },
      '/(?!png|jpg|gif)': {
        // target: `http://localhost:${mockServerPort}/mock-api/v1`,
        target: backEndServer,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
      }
    }
  },
  
  // pwa: {
  //   name: name,
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
  //   }
  // },
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: [
  //       path.resolve(__dirname, 'src/styles/_variables.scss'),
  //       path.resolve(__dirname, 'src/styles/_mixins.scss')
  //     ]
  //   }
  // },
  // chainWebpack(config) {
  //   // provide the app's title in webpack's name field, so that
  //   // it can be accessed in index.html to inject the correct title.
  //   config.set('name', name)

  //   // https://webpack.js.org/configuration/devtool/#development
  //   config
  //     .when(process.env.NODE_ENV === 'development',
  //       config => config.devtool('cheap-source-map')
  //     )

  //   config
  //     .when(process.env.NODE_ENV !== 'development',
  //       config => {
  //         config
  //           .optimization.splitChunks({
  //             chunks: 'all',
  //             cacheGroups: {
  //               libs: {
  //                 name: 'chunk-libs',
  //                 test: /[\\/]node_modules[\\/]/,
  //                 priority: 10,
  //                 chunks: 'initial' // only package third parties that are initially dependent
  //               },
  //               elementUI: {
  //                 name: 'chunk-elementUI', // split elementUI into a single package
  //                 priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
  //                 test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
  //               },
  //               commons: {
  //                 name: 'chunk-commons',
  //                 test: path.resolve(__dirname, 'src/components'),
  //                 minChunks: 3, //  minimum common number
  //                 priority: 5,
  //                 reuseExistingChunk: true
  //               }
  //             }
  //           })
  //         config.optimization.runtimeChunk('single')
  //       }
  //     )
  // }
}