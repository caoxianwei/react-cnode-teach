const path = require('path');
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    // 打包输出文件的存放地址
    path: path.join(__dirname, '../dist'),
    // 静态资源文件的引用路径
    // 如果是''，引用路径是:app.hash.js
    // 如果是'/public'，引用路径是/public/app.hash.js
    // 这个东西非常有用，可以帮我们去区分某个url是静态资源，还是api的请求，或者是某些需要特殊处理的请求
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
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
  },
}
