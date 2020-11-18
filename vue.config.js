/*
 * @Author: mingxing.huang
 * @Date: 2020-11-17 19:02:22
 */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '/',
  devServer: {
    open: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3009',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    // 设置别名
    config.resolve.alias.set('@', resolve('src'))
  }
}
