---
title: 加速网站速度的建议之Cookie篇
comments: true
date: 2021-06-28 17:09:03
categories:
tags:
---

这是我参与更文挑战的第28天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

继续学习雅虎关于加速网站的Cookie、CSS等内容。

## Cookie

### 减小Cookie大小

Cookie与认证、个性化相关功能有关，几乎每次HTTP请求，都会传递Cookie，因此，应该保持Cookie的大小较小，减少网络负载，从而减少Cookie对响应时间的影响。

相关策略包括：

1. 消除不必要的Cookie
2. 降低Cookie大小
3. 在适当的域名级别设置cookie，避免对子域名造成影响（这一点在下一小节中有具体例子）
4. 设置适当的过期时间（文中说应该让Cookie尽快过期为好）

### 对静态组件使用无Cookie域名

如对静态图片的请求，Cookie毫无用途，因此对这些请求应该不使用Cookie。建议设置无Cookie的子域名链接所有的静态组件。

类似`www.example.org`是主网站，而静态资源可存放在域名`static.example.org`下。若在顶级域名`example.org`设置Cookie，则请求`static.example.org`时，也会发送Cookie信息，浪费资源。如果情况已经发生，则需要另外购买域名来指向静态资源。

另外，一些代理可能拒绝缓存带有Cookie的请求信息。

## 掘金的Cookie评估

我们针对雅虎所说的Cookie优化，查看一下掘金的情况：

通过Chrome，F12，查看Network的情况，掘金首页的域名与Cookie情况大致如下：

```
https://juejin.cn/	   // 主站，favicon图片，有Cookie
b-gold-cdn.xitu.io     // css，根据域名判断应该是CDN，无Cookie
sf3-scmcdn2-tos.pstatp.com // svg、png、js, CDN， 无Cookie
sf3-ttcdn-tos.pstatp.com   // 图片，CDN,无Cookie
i.snssdk.com               // 似乎是第三方服务，部分有Cookie，部分无Cookie，snssdk.com会跳转至今日头条
abtestvm.bytedance.com     // 无Cookie
mcs.snssdk.com			  // 有Cookie
abtestvm.bytedance.com     // 无Cookie
api.juejin.cn			  // 有Cookie（Options请求无Cookie）
www.google-analytics.com   // 无Cookie，嵌入了Google分析工具
sf6-scmcdn-tos.pstatp.com  // js， CDN, 无Cookie
sf6-ttcdn-tos.pstatp.com   // 图片，CDN，无Cookie
p9-juejin.byteimg.com      // 图片, CDN，无Cookie
sf1-ttcdn-tos.pstatp.com   // 图片，CDN，无Cookie
p6-juejin.byteimg.com	   // 图片，CDN，无Cookie
p1-juejin.byteimg.com	   // 图片，CDN, 无Cookie
p3-juejin.byteimg.com	   // 图片，CDN, 无Cookie
```

参考之前的内容、服务器篇，掘金的首页配置，特别是针对“拆分组件到多个域名下”。掘金使用的CDN的数量也已经远远超过了4个。


1. [加速网站速度的建议之内容篇](https://juejin.cn/post/6977637802477355021)
2. [加速网站速度的建议之服务器篇一](https://juejin.cn/post/6977948072940666910)
3. [加速网站速度的建议之服务器篇二](https://juejin.cn/post/6978486791146110989)
