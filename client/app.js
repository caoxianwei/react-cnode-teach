import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

// 创建mui的主题
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { lightBlue, pink } from 'material-ui/colors';

import App from './views/App';
import { AppState, TopicStore } from './store/store';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    accent: lightBlue,
    type: 'light',
  },
})


// 先渲染挂载在body上面，因为还没写模板呢
// 推荐是不能这么挂载的
// ReactDOM.hydrate(<App />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));

const initialState = window.__INITIAL_STATE__ || {};// eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // 去掉服务端css
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }

  return Main;
}

const appState = new AppState();
appState.init(initialState.appState);
const topicStore = new TopicStore(initialState.topicStore);

const root = document.getElementById('root');
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <BrowserRouter>
        <Provider appState={appState} topicStore={topicStore}>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </Provider>
      </BrowserRouter>
    </AppContainer>,
    root,
  );
}

// render(App);
render(createApp(App));
// 需要热更新的代码出现的话
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default; // eslint-disable-line
    // render(NextApp);
    render(createApp(NextApp));
  })
}
