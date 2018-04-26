const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
module.exports = webpackMerge(baseConfig, {
  // js打包出来的内容，是使用在什么执行环境中的，可以是node或者是web
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  // externals可以指定，不将什么包，打包在输出的bundle里面
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    // 打包出来的js，所使用的模块加载方案，可以是：umd cmd amd commonjs
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3000"'
    })
  ]
})
