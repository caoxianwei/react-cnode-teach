import React from 'react';
// 在客户端用的是BrowserRouter
// 在node端用的是StaticRouter
import { StaticRouter } from 'react-router-dom';
// 在客户端只用Provider即可
// 在node端，需要用Provider和useStaticRendering
import { Provider, useStaticRendering } from 'mobx-react';

// material-ui相关
import { JssProvider } from 'react-jss';

import { MuiThemeProvider } from 'material-ui/styles';

import App from './views/App';

import { createStoreMap } from './store/store';

// 使用静态的渲染
// 让 mobx，在服务端渲染的时候，不会重复地进行数据的变换
// 因为 mobx，只要数据一变化，就会导致很多地方改变，严重地时候，会导致内存的溢出
useStaticRendering(true);

// 可能有多个store，因此用结构赋值 {...stores} 的方式，进行赋值
// 且每次用的都是新的store的数据
// context是进行服务端渲染的时候，传给StaticRouter的一个对象
// context里面有很多有用的信息，如 URL 等
export default (stores, routerContext, sheetsRegistry, jss, theme, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} jss={jss} >
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
);

export { createStoreMap };

