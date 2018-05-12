// 序列化
const serialize = require('serialize-javascript');
// 引入ejs
const ejs = require('ejs');
// 引入异步处理包
const asyncBootstrap = require('react-async-bootstrapper').default;
// 引入react-dom/server
const ReactDomServer = require('react-dom/server');
// 引入Helmet
const Helmet = require('react-helmet').default;

// 引入material-ui相关
const SheetsRegistry = require('react-jss').SheetsRegistry;
const create = require('jss').create;
const preset = require('jss-preset-default').default;
const createMuiTheme = require('material-ui/styles').createMuiTheme;
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default;
const colors = require('material-ui/colors');

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {})
};

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const user = req.session.user;

    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;

    const routerContext = {};
    const stores = createStoreMap();

    if (user) {
      stores.appState.user.isLogin = true;
      stores.appState.user.info = user;
    }

    // material-ui相关
    const sheetsRegistry = new SheetsRegistry();
    const jss = create(preset());
    jss.options.createGenerateClassName = createGenerateClassName;
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
        type: 'light'
      }
    })

    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url);

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

      const helmet = Helmet.rewind();

      // 打印出来看看
      console.log(stores.appState.count);

      const state = getStoreState(stores);

      const content = ReactDomServer.renderToString(app);

      // res.send(template.replace('<!--app-->', content));

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })

      res.send(html);
      resolve();
    })
      .catch(reject)
  })
}
