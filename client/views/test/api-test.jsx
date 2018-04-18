import React, { Component } from 'react';
import axios from 'axios';

/* eslint-disable */
export default class TestApi extends Component {
  constructor() {
    super();
  }

  // 客户端唯一使用accessToken的地方
  login() {
    console.log('login');
    axios.post('/api/user/login', {
      // accessToken: 'ca4cdc52-0c5e-4e60-9f41-94aee6144366'
      accessToken: 'ca4cdc52-0c5e-4e60-9f41-94aee616'
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  getToics() {
    console.log('login');
    axios.get('/api/topics')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  markAll() {
    console.log('login');
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div>
        <button onClick={e => this.login(e)}>login</button>
        <button onClick={e => this.getToics(e)}>getToics</button>
        <button onClick={e => this.markAll(e)}>markAll</button>
      </div>
    )
  }
}
/* eslint-enable */
