import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import TopicList from '../views/topic-list/index';
import TopicDetail from '../views/topic-detail/index';
// import UserInfo from '../views/user/info';
import UserLogin from '../views/user/login';

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={
        props => (
          isLogin ?
            <Component {...props} /> :
            <Redirect
              to={{
                pathname: '/user/login',
                search: `?from=${rest.path}`, // eslint-disable-line
              }}
            />
        )
      }
    />
  )
}

// const InjectedPrivateRoute = withRouter(inject(({ appState }) => {
//   return {
//     isLogin: appState.user.isLogin,
//   }
// })(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
  isLogin: PropTypes.bool,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

// react-16里面，组件之中，没必要返回的是一个dom节点，可以返回的是多个平行的dom的节点
// exact意思是说需要是完全匹配，如果不写这个东西的话，'/'会匹配所有的路由。因为所有的路由都带的有'/'
export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="/" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact key="user-login" component={UserLogin} />,
  // <InjectedPrivateRoute path="/user/info" component={userInfo} key="user-info" />,
]
