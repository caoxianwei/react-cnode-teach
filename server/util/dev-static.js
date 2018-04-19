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

// 引入异步处理包
const asyncBootstrap = require('react-async-bootstrapper').default;

// 引入react-dom/server
const ReactDomServer = require('react-dom/server');

// 实时，获取最新的template文件
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then((res) => {
        // axios请求的数据是放在data里面的
        resolve(res.data);
      })
      .catch(reject)
  })
}

// 构造函数--hack做法
const Module = module.constructor;

// 实例化MemoryFs
const mfs = new MemoryFs;
// 实时获取，服务端最新的bundle文件
// 首先启动一个webpack编译器，这个编译器会监控其serverConfig里面的entry文件，这个entry文件只要有变化，就会重新打包编译
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;

// 全局变量
let serverBundle, createStoreMap;

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
  const m = new Module();
  // 不要忘记文件名'server-entry.js'
  m._compile(bundle, 'server-entry.js');
  serverBundle = m.exports.default;
  createStoreMap = m.exports.createStoreMap;
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
  }, {})
};

module.exports = function (app) {

  // 将静态文件（/public开头的都是静态文件），全部代理出去，代理到客户端上面
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }));

  app.get('*', function (req, res) {
    getTemplate().then((template) => {
      /**
       * 这个serverBundle就是server-entry.js 这个文件export default出来的东西，也就是下面这个东西
       * export default (stores, routerContext, url) => (
       * <Provider {...stores}>
       * <StaticRouter context={routerContext} location={url}>
       * <App />
       * </StaticRouter>
       * </Provider>
       * );
       */

      const routerContext = {};

      const stores = createStoreMap();
      const app = serverBundle(stores, routerContext, req.url);

      asyncBootstrap(app).then(() => {
        // 下面的重定向，必须放在renderToString之后
        // 如果有路由的 redirect的话，
        // react-router会自动给 routerContext上面加上一个url的
        if (routerContext.url) {
          // 如果有这个属性的话，直接在node端给 redirect掉
          // 也就是路由重新定向
          // 302是重定向的意思
          // 直接让浏览器重定向
          res.status(302).setHeader('Location', routerContext.url);
          // 结束这次请求
          res.end();
          return;
        }
        // 打印出来看看
        console.log(stores.appState.count);

        const content = ReactDomServer.renderToString(app);
        res.send(template.replace('<!--app-->', content));
      })
    })
  })
}
