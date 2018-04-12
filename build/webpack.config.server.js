const path = require('path');
module.exports = {
  // js打包出来的内容，是使用在什么执行环境中的，可以是node或者是web
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/',
    // 打包出来的js，所使用的模块加载方案，可以是：umd cmd amd commonjs
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  }
}