---
title: hexo 博客如何更换电脑
categories: hexo
abbrlink: 7782
date: 2018-11-23 08:13:15
tags:
---

如何在更换电脑后继续使用Hexo部署博客

<!-- more -->

---
1.  重要目录
```
_config.yml
package.json
scaffolds/
source/
themes/
```

2. 在新电脑上配置hexo环境：安装node.js
3. 安装hexo，安装命令：
```shell
npm install -g hexo
```
4. 安装好之后，进入hexo／目录
5. 模块安装，执行命令：
```shell
npm install
npm install hexo-deployer-git --save
npm install hexo-generator-feed --save
npm install hexo-generator-sitemap --save
```
6. 部署，执行命令：
```shell
hexo generate --config your-config.yml
hexo server --config your-config.yml
hexo deploy
```

> 参考链接：https://blog.csdn.net/eternity1118_/article/details/71194395?ref=myread
