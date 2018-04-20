// axios这个库，在客户端和node端都可以很好使用，所以这个库
const axios = require('axios');

// 绝对路径
const path = require('path');

// 引入webpack和其服务端的配置
const webpack = require('webpack');
const serverConfig = require('../../build/webpack.config.server');

// 引入memory-fs模块
const MemoryFs = require('memory-fs');

// 引入http-proxy-middleware
const proxy = require('http-proxy-middleware');

const serverRender = require('./server-render');

// 实时，获取最新的template文件
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        // axios请求的数据是放在data里面的
        resolve(res.data);
      })
      .catch(reject)
  })
}

// 构造函数--hack做法
// const Module = module.constructor;

// node的原生的module模块
const NativeModule = require('module');
const vm = require('vm');

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
};

// 实例化MemoryFs
const mfs = new MemoryFs;
// 实时获取，服务端最新的bundle文件
// 首先启动一个webpack编译器，这个编译器会监控其serverConfig里面的entry文件，这个entry文件只要有变化，就会重新打包编译
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;

// 全局变量
let serverBundle;

serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  // stats是webpack打包编译过程中，输出的一些信息
  stats = stats.toJson();
  // 如果出现错误或者警告的信息，就逐个输出这些警告和错误的信息
  stats.errors.forEach(err => console.error(err));
  stats.warnings.forEach(warn => console.warn(warn));

  // 获取bundle的路径
  // serverConfig.output.path这个路径下面的这个文件名serverConfig.output.filename
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  // 读取文件--是string类型的 注意是utf-8的
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');

  // 将上述文件，转化为js可以使用的模块内容--需要借助一种比较hack的方式
  // 实例化一个Module，然后去解析string--再放到一个外部的全局变量中
  // const m = new Module();
  // 不要忘记文件名'server-entry.js'
  // m._compile(bundle, 'server-entry.js');

  const m = getModuleFromString(bundle, 'server-entry.js');
  serverBundle = m.exports;
})

module.exports = function (app) {

  // 将静态文件（/public开头的都是静态文件），全部代理出去，代理到客户端上面
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }));

  app.get('*', function (req, res, next) {
    // 优化
    if (!serverBundle) {
      return res.send('正在编译中...');
    }
    getTemplate().then((template) => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next);
  })
}
