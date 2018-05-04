import React from 'react';

import { Route, Redirect } from 'react-router-dom';

import TopicList from '../views/topic-list/index';

import TopicDetail from '../views/topic-detail/index';

import TestApi from '../views/test/api-test';


// react-16里面，组件之中，没必要返回的是一个dom节点，可以返回的是多个平行的dom的节点
// exact意思是说需要是完全匹配，如果不写这个东西的话，'/'会匹配所有的路由。因为所有的路由都带的有'/'
export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="first" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/test" component={TestApi} key="test" />,
]
