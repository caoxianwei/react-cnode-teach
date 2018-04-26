import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Tabs, { Tab } from 'material-ui/Tabs';
// import Button from 'material-ui/Button';
import { AppState } from '../../store/app-state';
import Container from '../layout/container';
import TopicListItem from './list-item';

// 装饰器注入
// observer意思，就是监控变化，mobx值一变，视图就变化
@inject('appState') @observer
export default class TopicList extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
    }
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

  tabChange(event, index) {
    this.setState({
      tabIndex: index,
    })
  }

  listItemClick(e) {
    // do some
    console.log(e.target);
  }

  render() {
    // 可以看出来，每次组件的state一改变，就会触发render函数重新执行
    const { tabIndex } = this.state;
    const topic = {
      tab: '关赛鹏',
      title: '关赛鹏的第一次评论',
      userName: 'gsp',
      reply_count: 1000,
      visit_count: 999,
      create_at: '2018-04-26',
    };
    return (
      <Container>
        <Helmet>
          <title>gsp-cnode话题列表</title>
          <meta name="description" content="gsp-cnode话题列表" />
        </Helmet>
        <Tabs value={tabIndex} onChange={(e, index) => this.tabChange(e, index)}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <TopicListItem onClick={e => this.listItemClick(e)} topic={topic} />
      </Container>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
