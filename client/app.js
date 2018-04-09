import React from 'react';
import ReactDOM from 'react-dom';
// 这个jsx的后缀名现在还需要写，因为, 此时的webpack还没配置忽略后缀名的方法
import App from './App.jsx';

// 先渲染挂载在body上面，因为还没写模板呢
// 推荐是不能这么挂载的
ReactDOM.hydrate(<App />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));