---
title: axio如何取消请求
comments: true
date: 2021-06-17 09:00:36
categories:
tags:
---



这是我参与更文挑战的第21天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

## 起源

某个页面需要下载全部数据的功能，下载数据量大，接口延迟长.....

某个页面加载初始数据量延长长，但单个检索快速，出现初始数据加载中时，检索接口返回，初始数据后续返回覆盖了检索数据的展示....

这些情况需要我们：

1. 能够手动取消/终止请求Request。
2. 某些页面接口同时只能有一个在请求。

## 现状

系统基于老哥花裤衩开源的vue-element-admin做的二次开发，其中的请求采用的是axios，其中封装的`request.js`关键代码如下所示：

```javascript
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000, // request timeout
  transformRequest: [function(data) {
    // 对 data 进行任意转换处理
    return Qs.stringify({
      ...data
    },
    // 数组的转换
    { arrayFormat: 'brackets' })
  }]
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
```

发起请求的方法：

```javascript
export function remoteApi(data) {
  return request({
    url: '/api',
    method: 'post',
    data
  })
}
```

 

## 取消请求 cancelToken

其官方文档：[取消](http://www.axios-js.com/zh-cn/docs/#%E5%8F%96%E6%B6%88): 

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
     // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```



## 修改后的请求方法

```javascript
export function remoteApi(data, cancelToken) {
  return request({
    url: '/api',
    method: 'post',
    cancelToken,
    data
  })
}
```

实际请求时，创建cacelToken：

```javascript
// 组件方法内
this.cancelToken = CancelToken.source()
remoreApi(data, this.cancelToken).then(....).catch(....).finally(....)
```

需要取消请求时，执行：

```javascript
// 组件方法内
this.cancelToken.cancel('取消下载')
```

## 避免重复请求

避免一个接口的重复请求，以免延时长的接口返回数据覆盖另一个接口的返回数据，造成数据显示错误。思路也相对简单，使用一个全局`Map`存储请求标识与对应的`cancelToken`。请求，在发起请求前，按照请求标识，唤起对应cancelToken的cancel方法，然后再发出新请求，即可满足条件。

