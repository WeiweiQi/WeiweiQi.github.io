---
title: 纯前端解决axios下载文件名中文乱码问题
comments: true
date: 2021-03-31 12:45:05
categories: 前端
tags: JavaScript
---





起因是通过



1. 确认返回数据无误

   通过Fiddler等抓包软件，确认返回数据正确：

![fiddler-filename确认.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb51aae6d65f489c8fe33626384616e0~tplv-k3u1fbpfcp-watermark.image)

2. 曾尝试方案：

   decode

   decodeURL..

3. 解决方案：使用iconv-lite包

