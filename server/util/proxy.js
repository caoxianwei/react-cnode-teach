// 这个js里面，将所有的发到cnode的接口，全部代理出去
const axios = require('axios');

const queryString = require('query-string');

// cnode网站，公用的URL片段
const baseUrl = 'http://cnodejs.org/api/v1';

module.exports = function (req, res, next) {
  // 请求的地址
  const path = req.path;
  // 判断用户是否登录
  const user = req.session.user || {};
  // cnode的这个接口，是否需要accesstoken
  // 放在req.query上面
  const needAccessToken = req.query.needAccessToken;
  // 如果这个接口需要accesstoken，但是session里面没有
  if (needAccessToken && !user.accessToken) {
    // 接口401
    res.status(401).send({
      success: false,
      msg: '请登录'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  });

  if (query.needAccessToken) {
    delete query.needAccessToken;
  }

  // 代理请求
  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    // 如果没用queryString.stringify的话，===> {'accesstoken':'xxxx'}
    // 如果用queryString.stringify的话，=====> accesstoken=xxxx---就跟用formData也就是form表单请求，那样的格式
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    // axios发送的时候，默认是application/json
    // 因为cnode API所有的接口，都可以接受application/x-www-form-urlencode格式的数据，也就是formData格式的数据
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data);
      } else {
        res.status(resp.status).send(resp.data);
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data);
      } else {
        res.status(500).send({
          success: false,
          msg: '未知错误'
        })
      }
    })

}
