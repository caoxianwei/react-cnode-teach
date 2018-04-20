import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { AppState } from '../../store/app-state';

// 装饰器注入
// observer意思，就是监控变化，mobx值一变，视图就变化
@inject('appState') @observer
export default class TopicList extends Component {
  constructor() {
    super();
    // do some here
  }
  componentDidMount() {
    // do some here
  }

  asyncBootstrap() {
    // 在这个方法里面，可以去异步操作我们的数据，我们的内容
    // 在我们的node端里面的dev-static.js里面，去调用这个方法的话，就会执行这个方法里面的东西
    // 等这个执行完了之后，才会继续去执行服务端渲染的工作
    // 所以这个方法很强大，可做很多事情，如，数据初始化等
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        // asyncBootstrap这个东西，会根据我们resolve（true还是false）来判断我们这个方法是否执行成功
        resolve(true);
      }, 1000)
    })
  }

  inputChange(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>这是话题列表页面</title>
          <meta name="description" content="这是话题列表页面的描述，哈哈哈哈" />
        </Helmet>
        <div>TopicList</div>
        <div>
          <input type="text" onChange={e => this.inputChange(e)} />
          <span>{this.props.appState.msg}</span>
        </div>
      </div>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
