import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
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

  inputChange(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <div>
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
