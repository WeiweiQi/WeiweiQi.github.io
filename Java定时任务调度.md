---
title: Java定时任务调度
comments: true
abbrlink: 31c4
date: 2019-01-09 20:33:19
categories:
  java
tags:
---

<!-- more -->

【强制】多线程并行处理定时任务时， Timer 运行多个 TimeTask 时，只要其中之一没有捕获
抛出的异常，其它任务便会自动终止运行，使用 ScheduledExecutorService 则没有这个问题。





https://www.cnblogs.com/aspirant/p/6812880.html

https://blog.csdn.net/lvoyee/article/details/21644377
