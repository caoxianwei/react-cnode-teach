import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

@inject((stores) => {
  return {
    appState: stores.appState,
  }
}) @observer
class MainAppBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
  }

  onHomeIconClick() {
    this.context.router.history.push('/list?tab=all');
  }

  createButtonClick() {
    // console.log(222);
  }

  loginButtonClick() {
    if (this.props.appState.user.isLogin) {
      this.context.router.history.push('/user/info');
    } else {
      this.context.router.history.push('/user/login');
    }
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.appState;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="contrast" onClick={e => this.onHomeIconClick(e)}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              gspNode
            </Typography>
            <Button raised color="accent" onClick={e => this.createButtonClick(e)}>
              新建话题
            </Button>
            <Button color="contrast" onClick={e => this.loginButtonClick(e)}>
              {
                user.isLogin ? user.info.loginname : '请登录'
              }
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
