const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
// react服务端渲染的主要模块
const ReactSSR = require('react-dom/server');
// fs模块
const fs = require('fs');
// 绝对路径
const path = require('path');

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

const app = express();

// 将application的json的格式的数据，转化为req.body上面的数据
app.use(bodyParser.json());
// 将application的formData的格式的数据，转化为req.body上面的数据
app.use(bodyParser.urlencoded({ extended: false }));

// 真正上线的话，session是要存在数据库中的，作为缓存或者ruandeisi
// 现在的话，放到node端，也就是启动之后，直接放在内存中，跟着我们的服务一起启动
// node服务一旦出现问题，就需要重新登录
// 服务启动，给session设置值
app.use(session({
  maxAge: 10 * 60 * 1000, // 10分钟
  name: 'tid',// cookie ID的名字
  resave: false,// 每次请求，是否需要重新生成一个cookie id，一般不需要，太浪费资源
  saveUninitialized: false, // 同上个
  secret: 'react cnode class'// 用一个字符串去加密我们的cookie
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')));

// 一定要放在服务端渲染的代码的前面
app.use('/api/user', require('./util/handle-login'));
app.use('/api', require('./util/proxy'));

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
