import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import App from './views/App';
import AppState from './store/app-state';


// 先渲染挂载在body上面，因为还没写模板呢
// 推荐是不能这么挂载的
// ReactDOM.hydrate(<App />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));

const root = document.getElementById('root');
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <BrowserRouter>
        <Provider appState={new AppState()}>
          <Component />
        </Provider>
      </BrowserRouter>
    </AppContainer>,
    root,
  );
}

render(App);
// 需要热更新的代码出现的话
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default; // eslint-disable-line
    render(NextApp);
  })
}
