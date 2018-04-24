import React, { Component } from 'react';
import Routes from '../config/router';
import AppBar from './layout/app-bar';

export default class App extends Component {
  componentDidMount() {
    // do something
  }

  render() {
    return [
      <AppBar key="appBar" />,
      <Routes key="routes" />,
    ]
  }
}
