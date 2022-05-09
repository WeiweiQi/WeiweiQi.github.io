---
title: 使用httpwatch测试网站性能
comments: true
date: 2021-06-23 15:35:48
categories:
tags:
---

这是我参与更文挑战的第23天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 只有发现问题,才能解决问题。

## 起源

网站卡顿，主要表现在首页首次加载长期Loading、页面跳转可以明显看到浏览器跳转进度条缓慢移动。

（我也没办法，我也不知道，不要冲一个前些天刚从后端转过来的前端er发什么火！[/可怜]）

## 寻找前端性能定位工具

查书籍吧，查到一本名为《精通软件性能测试与LoadRunner实战》。书中第13节介绍了一些工具，其中包括HttpWatch，Page Speed，Dyna Trace，Yslow等。通过这些工具可以获取系统前端的性能指标相关信息。对解决问题不知道有没有用，但肯定能**发现问题**。

一个一个学吧！

## HttpWatch简介

HttpWatch，网页数据分析工具，可集成在浏览器工具栏中，功能主要有网页摘要、Cookie管理、缓存管理、消息头发送/接收、字符查询、POST数据、目录管理功能、报告输出等。**能够在显示网页的同时显示网页请求和返回的日志信息**。目前有基础版Basic Edition和专业版Professional Edition。

官网地址：https://www.httpwatch.com/

下载地址：https://www.httpwatch.com/download/

没关系，先去Chrome应用市场下一个扩展插件试一下，结果：

> You have installed the HttpWatch for Chrome extension but the HttpWatch software is not installed or is out of date. Click the button below to download HttpWatch for Windows.

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b2d6eddd6ce4a868ff8358bb39373fa~tplv-k3u1fbpfcp-watermark.image)

安装软件，基础版，Go....

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15f32ba58bd44f6eb1d9e9c9354c5d7b~tplv-k3u1fbpfcp-watermark.image)

安装完成后还有一个帮助文档：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0faf24bbbd1b42f285175e5dbf9d0dd8~tplv-k3u1fbpfcp-watermark.image)

## 基础使用

点击浏览器扩展插件，浏览器弹出：“httpWatch”已开始调试此浏览器。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddf06e28908f449bb36875cdda79698c~tplv-k3u1fbpfcp-watermark.image)

注意：**要测试的网站或页面必须在本标签页下输入与变动，否则HttpWatch侦听不到**。

比如我们输入"juejin.cn"，测试截图情况如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da9bccaa5f554a01b84c20837cdf2a43~tplv-k3u1fbpfcp-watermark.image)

上方的各列表示含义分别是：

Started： 表示记录URL的起始时间

Time：从请求发出直到最后的结果所耗费的时间

Sent：发送请求时传送的字节

Received：系统响应结果接收的字节

Method：请求过程中使用的方法，如GET, POST

Result：系统返回的请求结果，状态码

Type：已图标形式提现下载的数据类型，可通过鼠标移动查看文本提示信息

URL：显示当前请求的页面URL地址。

想看某条具体请求的具体时间情况，即下方的Time Chart，结果：Not Available For Basic Edition！

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79bc66e30f774fb0b3b81dfc930abf8f~tplv-k3u1fbpfcp-watermark.image)

借用一张书中的图，一个请求的Time Chart应该是以下样子：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deb3613b682248bb87c91b13d32c7609~tplv-k3u1fbpfcp-watermark.image)

各个阶段的含义：

Blocked：阻塞时间，包括任何预处理时间（比如缓存查找）和等待网络连接可用花费的时间。个人理解相当于Chrome Network分析中的Queueing与Stalled。

DNS Lookup：DNS解析主机名到IP地址所花费的时间。

Connect：创建一个TCP连接到Web服务器所需的时间，如果是HTTPS，则还包括SSL握手过程。

Send：发送请求到服务器所需的时间

Wait：等待从服务器得到响应消息的时间，包括由于网络延迟和请求Web服务器的时间，这个值基本反应了后台接口的响应速度。

Receive：接受响应消息的时间，该值取决于内容返回的大小、网络带宽和是否使用了HTTP压缩。

TTFB：从浏览器发出请求到服务器返回第一个字节所耗费的时间，包括TCP连接耗时，发送请求时间，接收第一个字节的响应消息时间。

Network：是一个HTTP请求在网络消息传输上耗费的时间。



## 分析与结论

通过对自己的网站进行分析，发现除接口请求时长大外，打包出来的`js`、`css`文件也非常的大。

有两个方案：

1. 使用ugliyjs或者gzip进行压缩
2. 使用cdn缩小文件传输时长

当然两个方案可以同时进行。
