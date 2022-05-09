---
title: mybatis学习笔记1——程序框架了解
comments: true
date: 2021-11-05 16:31:10
categories:
tags:
---



这是我参与11月更文挑战的第5天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)

> 很多Java小伙伴自嘲是Spring工程师，但更可悲的是，还有很多前端同学压根就意识不到自己是Vue工程师

嗯，这说的就是我啊！

## 为什么学mybatis

最近小伙伴推了一个好用的前后台分离的管理系统：若依(Ruoyi)，相信不少小伙伴都用过或者听过。

基础页面长这个样子：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c82fd33ff8c4784861c679a163720f5~tplv-k3u1fbpfcp-watermark.image?)

之前生产环境用的是国产开源框架jfinal中集成的数据库访问组件，为了避免把自己绑死的一个框架上，多学点东西总是有益的。

若依中用的数据库组件是mybatis，也借着更文，系统的学习一下mybatis吧。

## mybatis官方文档

目前是按照这一套[官网文档](https://mybatis.org/mybatis-3/zh/getting-started.html)学习。

## 若依中的mybatis架构

按照程序员的直觉和若依框架中的简单教程做了一个简单页面，执行了几个简单的sql，大致清楚了mybatis的框架。若依的框架大致有这样几部分：

### controller

controller基本位于若依框架中的`admin`中：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24e661cb268249d780e023a3aff1becd~tplv-k3u1fbpfcp-watermark.image?)

### service

service则根据功能版块拆分到各个子`module`中，如`common`, `framework`, `system`等，需要自己的业务版块可以新建新的modeul。 （这一点体现出jetbrain idea是真的好用）

### mybatis架构

mybatis主要体现在若依的`system`版块中。System版块的项目截图如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea40473ccdef4ea8ad8d503b0e6f5428~tplv-k3u1fbpfcp-watermark.image?)

可以清晰的看到，其中分为`domain`，`mapper`，`service`文件夹，以及保存sql的xml文件包。

#### domain

domain，也就是通常说的DO, Domain Object，领域对象，网上查到的概念是：从现实世界中抽象出来的有形或无形的业务实体。

#### mapper

mybatis基础的通用mapper，通过配置可以自动生成单表的增删改查。这个是用来降低开发成本，减少程序员的工作量的。

#### service

这各基本和mybatis没什么关系了，是向上提供服务方法的，一般应该是一个完整的业务方法。

## mybatis的配置

若依哪里配置了mybatis呢？

根据以往其他框架的经验，我们从spring的配置文件入手即可在`admin`版块中发现：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/721b8cd812654ab49cb0b81c13c03bd7~tplv-k3u1fbpfcp-watermark.image?)
