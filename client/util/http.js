import axios from 'axios';
// 在客户端访问的话，等于''
const baseUrl = process.env.API_BASE || '';

const parseUrl = (url, params) => {
  const str = Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`;
    return result;
  }, '');

  return `${baseUrl}/api/${url}?${str.substr(0, str.length - 1)}`;
}

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then((resp) => {
        const data = resp.data;
        if (data && data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(reject)
  })
}

export const post = (url, params, data) => {
  return new Promise((resolve, reject) => {
    axios.post(parseUrl(url, params), data)
      .then((resp) => {
        const datas = resp.data;
        if (datas && datas.success === true) {
          resolve(datas);
        } else {
          reject(datas);
        }
      })
      .catch(reject)
  })
}
