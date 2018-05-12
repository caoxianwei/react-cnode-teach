import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
// import Button from 'material-ui/Button';
import querystring from 'query-string';
// import { AppState } from '../../store/app-state';
import Container from '../layout/container';
import TopicListItem from './list-item';
import { tabs } from '../../util/variable-define';

// 装饰器注入
// observer意思，就是监控变化，mobx值一变，视图就变化
@inject((stores) => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
export default class TopicList extends Component {
  // react-router从最顶层加入之后，可以在任何组件里面通过这种方式获取
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super();
    this.listItemClick = this.listItemClick.bind(this);
  }

  componentDidMount() {
    const tab = this.getTab();
    this.props.topicStore.fetchTopics(tab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search));
    }
  }

  getTab(search) {
    search = search || this.props.location.search;
    const query = querystring.parse(search);
    const tab = query.tab;
    return tab || 'all';
  }

  asyncBootstrap() {
    // 在这个方法里面，可以去异步操作我们的数据，我们的内容
    // 在我们的node端里面的dev-static.js里面，去调用这个方法的话，就会执行这个方法里面的东西
    // 等这个执行完了之后，才会继续去执行服务端渲染的工作
    // 所以这个方法很强大，可做很多事情，如，数据初始化等
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     this.props.appState.count = 3;
    //     // asyncBootstrap这个东西，会根据我们resolve（true还是false）来判断我们这个方法是否执行成功
    //     resolve(true);
    //   }, 1000)
    // })
    const query = querystring.parse(this.props.location.search);
    const tab = query.tab;
    return this.props.topicStore.fetchTopics(tab || 'all')
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      })
  }

  tabChange(event, value) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    })
  }

  listItemClick(e, topic) {
    this.context.router.history.push(`/detail/${topic.id}`);
  }

  render() {
    const { topicStore } = this.props;
    const topicList = topicStore.topics;
    const syncingTopic = topicStore.syncing;
    const tab = this.getTab();
    const { createdTopics } = topicStore;
    const { user } = this.props.appState;

    return (
      <Container>
        <Helmet>
          <title>gsp-cnode话题列表</title>
          <meta name="description" content="gsp-cnode话题列表" />
        </Helmet>
        <Tabs value={tab} onChange={(e, value) => this.tabChange(e, value)}>
          {
            Object.keys(tabs).map(key => (
              <Tab key={key} label={tabs[key]} value={key} />
            ))
          }
        </Tabs>
        {
          (createdTopics && createdTopics.length) ?
            <List style={{ backgroundColor: '#dfdfdf' }}>
              {
                createdTopics.map((topic) => {
                  topic = Object.assign({}, topic, {
                    author: user.info,
                  });
                  return (
                    <TopicListItem key={topic.id} onClick={() => this.listItemClick(event, topic)} topic={topic} />
                  )
                })
              }
            </List> : null
        }
        <List>
          {
            topicList.map(topic => <TopicListItem key={topic.id} onClick={() => this.listItemClick(event, topic)} topic={topic} />)
          }
        </List>
        {
          syncingTopic ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '40px 0' }}>
              <CircularProgress color="accent" size={100} />
            </div>
          ) : null
        }
      </Container>
    );
  }
}

// mobx注入的属性都需要加一个wrappedComponent
TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
