// 利用path这个包，来完成绝对路径的书写，因为用相对路径的话，可能会出现系统之间的差异等问题
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const HTMLPlugin = require('html-webpack-plugin');

// 判断环境是不是开发环境
const isDev = process.env.NODE_ENV === 'development';
const config = webpackMerge(baseConfig, {
  // 应用的入口
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  // 打包的输出
  // []是变量的意思，hash的话，就是根据文件内容，去计算得出的hash值
  // 如app.xjjxjsjjd11224sss.js
  // 这样就可以达到最大化地使用浏览器的缓存
  output: {
    // 打包输出文件的文件名
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  };

  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config;
