import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

class MainAppBar extends React.Component {
  constructor() {
    super();
  }

  onHomeIconClick() {
    // console.log(111);
  }

  createButtonClick() {
    // console.log(222);
  }

  loginButtonClick() {
    // console.log(333);
  }

  render() {
    const { classes } = this.props;
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
              登录
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
