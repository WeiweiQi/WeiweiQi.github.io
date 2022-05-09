---
title: 初识kubernetes
comments: true
date: 2021-06-16 18:15:56
categories: 后端
tags: 后端
---



这是我参与更文挑战的第17天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

本文是在[掘力计划沙龙：拥抱云原生——探索云原生下的框架与存储](https://www.bagevent.com/event/7487403)前的学习文章。

在[拥抱云原生——初探Quarkus](https://juejin.cn/post/6972520666641743908)，[拥抱云原生——云原生概念与Quarkus基本使用](https://juejin.cn/post/6973543019932811278)两篇文章中，我们初步了解了一下云原生的概念，Quarkus的使用。了解到Quarkus是一个针对K8s的原生JAVA框架，针对GraalVM和HotSpot进行量身定制。

这里面又涉及到许多新的概念：K8S, GraalVM等。一个一个学吧，我们先来了解一个K8S——Kubernetes。

> 让营地比你来时更干净。——《代码整洁之道》

## Kubernetes相关文档

官网：[英文](https://kubernetes.io) [中文](https://kubernetes.io/zh/)

中文概述：[Kubernetes 是什么？](https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/)

其他文档：[Kubernetes是什么](http://docs.kubernetes.org.cn/227.html)

## 基础概念与特点

Kubernetes是Google开源的容器编排引擎，即**K8S是一个管理容器的工具**。

在文档[Kubernetes是什么](http://docs.kubernetes.org.cn/227.html)中，概述Kubernetes的用途：

> 快速部署应用
>
> 快速扩展应用
>
> 无缝对接新的应用功能
>
> 节省资源，优化硬件资源的使用

其特点为：

> **可移植**: 支持公有云，私有云，混合云，多重云（multi-cloud）
>
> **可扩展**: 模块化, 插件化, 可挂载, 可组合
>
> **自动化**: 自动部署，自动重启，自动复制，自动伸缩/扩展

Kubernetes 是一个可移植的、可扩展的开源平台，用于管理容器化的工作负载和服务，可促进声明式配置和自动化。 Kubernetes 拥有一个庞大且快速增长的生态系统。Kubernetes 的服务、支持和工具广泛可用。

下图[1]比较了三种系统部署方案：

![container_evolution.svg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13e3f0f10d5d4b5b843aa6f93a52eef5~tplv-k3u1fbpfcp-watermark.image)

1. 传统部署：应用程序运行在物理服务器上
2. 虚拟部署：在物理服务器上运行多个虚拟机，应用程序运行在虚拟机上
3. 容器部署：容器类似与VM，具有自己的文件系统，CPU，内存，进程空间等，但是轻量的（App共享操作系统），可以跨云和OS发行版本进行移植。

容器可以提供**敏捷应用程序的创建和部署，持续开发、集成和部署等多个好处**[1]

Kubernetes 就是管理这些容器的一个工具，有诸如扩展要求、故障转移、部署模式等多种功能，K8s提供的好处包括：**服务发现和负载均衡**，**存储编排**，**自动部署和回滚**，**自动完成装箱计算**，**自我修复**，**密钥与配置管理**[1]

## 总结

​	K8S是一个管理容器的工具



[1]  Kubernetes 是什么？](https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/)

