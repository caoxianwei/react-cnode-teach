const express = require('express');
const favicon = require('serve-favicon');
// react服务端渲染的主要模块
const ReactSSR = require('react-dom/server');
// fs模块
const fs = require('fs');
// 绝对路径
const path = require('path');

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

const app = express();

app.use(favicon(path.join(__dirname, '../favicon.ico')));

if (!isDev) {
  // 不是开发环境的时候，这么做
  // 编译出来的server-entry.js
  const serverEntry = require('../dist/server-entry').default;
  // 同步地读取文件, 同时指定utf8的格式，这样才是string
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  // 专门处理静态文件的，目前，静态文件都是在dist目录下面
  app.use('/public', express.static(path.join(__dirname, '../dist')));
  // 从浏览器端发出来的任何请求，都返回服务端渲染的代码
  app.get('*', function (req, res) {
    // 服务端渲染
    const appString = ReactSSR.renderToString(serverEntry);
    // 替换，然后返回浏览器
    res.send(template.replace('<!--app-->', appString));
  });
} else {
  // 是开发环境的时候，这么做
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

// 监听端口
app.listen(3333, function () {
  console.log('3333服务启动了');
});
