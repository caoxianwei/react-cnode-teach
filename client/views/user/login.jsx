import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import UserWrapper from './user';
import loginStyles from './styles/login-style';

@inject((stores) => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  }
}) @observer
class UserLogin extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      accesstoken: '',
      // ca4cdc52-0c5e-4e60-9f41-94aee6144366
      helpText: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  // componentWillMount() {
  //   if (this.props.user.isLogin) {
  //     // 如果已经登录了，我们不希望用户跳到新的页面之后，再重新又跳过去，从而陷入无限地循环中
  //     this.context.router.history.replace('/user/info');
  //   }
  // }

  getFrom(location) {
    location = location || this.props.location;
    console.log(this.props);
    const query = queryString.parse(location.search);
    return query.from || '/user/info';
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  handleLogin() {
    if (!this.state.accesstoken) {
      this.setState({
        helpText: '必须填写accessToken',
      });
      return;
    }
    this.setState({
      helperText: '',
    })

    this.props.appState.login(this.state.accesstoken)
      // .then(() => {
      //   this.context.router.history.replace('/user/info');
      // })
      .catch((err) => {
        console.log(err) // eslint-disable-line
      })
  }

  render() {
    const { classes } = this.props;
    const from = this.getFrom();
    const { isLogin } = this.props.user;
    if (isLogin) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入您的Cnode网站的AccessToken"
            placeholder="请输入您的Cnode网站的AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            raised
            color="accent"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登录
          </Button>
        </div>
      </UserWrapper>
    );
  }
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

UserLogin.propTypes = {
  classes: PropTypes.object,
}

export default withStyles(loginStyles)(UserLogin);

