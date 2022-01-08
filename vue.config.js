'use strict'


const path = require('path')
// 通过缓存提升二次打包速度
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.hzdl.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.hzdl.com/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：true | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: process.env.port || process.env.npm_config_port || 80,
    open: true,
    disableHostCheck: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8080`,
        // target: `http://10.112.57.239:8080`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      '/file-api': {
        target: `http://10.112.56.65:3080`,
        // target: `http://10.112.57.239:8082`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/file-api']: ''
        }
      }
    }
  },
  configureWebpack: {
    name: require('./src/settings.js').title,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src')
      }
    },
    devtool: 'source-map',
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path][name].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|json|ttf)(\?.*)?$/i,
        threshold: 0,
        minRatio: 0.8
      }),
      // 通过缓存提升二次打包速度
      // new HardSourceWebpackPlugin()
    ],
    module: {
      rules: [
        {
          // 对所有js后缀的文件进行编译
          test: /.js$/,
          // 表示在src目录下的.js文件都要进行一下使用的loader
          include: resolve('src'),
          exclude: resolve('node_modules'),
          use: [
            'babel-loader',
            {
              loader: 'thread-loader',
              options: {
                workers: require('os').cpus().length
              }
            }
          ]
        }
      ]
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })

          config.optimization.minimizer('terser').tap((config) => {
            // 注释console.*
            config[0].terserOptions.compress.drop_console = true
            // remove debugger
            config[0].terserOptions.compress.drop_debugger = true
            // 移除 console.log
            config[0].terserOptions.compress.pure_funcs = ['console.log']
            return config
          })

          config.optimization.runtimeChunk('single'), {
            from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
            to: './' //到根目录下
          }
        }
      )
  }
}

function resolve(dir) {
  return path.join(__dirname, dir)
}
