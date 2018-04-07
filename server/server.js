const express = require('express');
// react服务端渲染的主要模块
const ReactSSR = require('react-dom/server');
// fs模块
const fs = require('fs');
// 绝对路径
const path = require('path');
// 编译出来的server-entry.js
const serverEntry = require('../dist/server-entry').default;

// 同步地读取文件, 同时指定utf8的格式，这样才是string
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

const app = express();

// 专门处理静态文件的，目前，静态文件都是在dist目录下面
app.use('/public', express.static(path.join(__dirname, '../dist')));

// 从浏览器端发出来的任何请求，都返回服务端渲染的代码
app.get('*', function (req, res) {
  // 服务端渲染
  const appString = ReactSSR.renderToString(serverEntry);
  // 替换，然后返回浏览器
  res.send(template.replace('<app></app>', appString));
});

// 监听端口
app.listen(3333, function () {
  console.log('3333服务启动了');
});