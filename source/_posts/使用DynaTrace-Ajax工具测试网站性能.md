---
title: 使用DynaTrace Ajax工具测试网站性能-以失败终
comments: true
date: 2021-06-24 08:35:38
categories:
tags:
---

这是我参与更文挑战的第24天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

## 起源

在上一篇文章：[使用httpwatch测试网站性能](https://juejin.cn/post/6976929429415002125)，我们使用httpwatch能够快捷的发现网页的加载速度情况，包括网站资源文件，网站后台接口请求速度，但有时仍然难以发现隐藏在js中的卡顿问题和渲染问题。

在阅读《精通软件性能测试与LoadRunner实战》一书中，发现了作者推荐的几款测试软件，其中包括HttpWatch，Page Speed，Dyna Trace，Yslow等。继Httpwatch后，我们来研究学习一下DynaTrace Ajax。

But，这个软件的官网原本是：**ajax.dynatrace.com**，但是现在已经打不开了，毕竟这个软件介绍上说是适用于IE, Chrome，但是好像和这个软件关系不大。从其他博客找到软件，试一下吧。

其实，这时候我大概觉得，这个软件大概率已经OUT了！

## 简介

利用DynaTrace Ajax，可分析页面渲染时间，DOM方法执行时间，甚至看到JS代码的解析时间。

> Dyna Trace Ajax是一个详细的低层追踪工具，...显示所有请求和文件在网络中的传输时间，还会记录浏览器Render、CPU消耗、Javascript解析和运行情况等....



## 下载安装

下载可是费了些周章，一开始我只有一个想法，去官网下，去官网下，去官网下。

但是官网下载页面已经打不开了。

有去各个博客中的网盘上找，也失败了。

最后，只能从各个第三方下载站下载了，慌慌哒，别中毒啊！

最后下载安装包是：dynatrace-AJAX-edition-3.6.0.1053.msi。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5fe8e0f068b4933ac1fdfb75ea309db~tplv-k3u1fbpfcp-watermark.image)

## 使用

打开后就提示：软件免费，但是需要加入社区！想着输入地址，姓名，密码，Create New Account，但是Not Work，估计版本太老，后端注册相关的也已经没了，暂且试用吧！

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/700e50f74bd54b8982e52a4cbd97fd2f~tplv-k3u1fbpfcp-watermark.image)

仔细查看，这个页面需要填入IE浏览器执行目录与FireFox目录。OK，Go！

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bd1c3b7d9a84b3ea6205ed6362031ab~tplv-k3u1fbpfcp-watermark.image)

我们还是和httpwatch一样，先对掘金首页开启一拨测试。如下图所示，Run。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12120e04d82840b5889d73cb7f8b0a08~tplv-k3u1fbpfcp-watermark.image)



Not Working, 悲催啊！换几个版本试试吧！

## 总结

不能说被书坑了吧，今天查了一下书籍《精通软件性能测试与LoadRunner实战》的编写时间，出版时间是2013年，应该说不算太早吧，软件行业更新太快了！

