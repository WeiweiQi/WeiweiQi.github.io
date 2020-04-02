---
title: jfinal各类职责的理解
date: 2018-12-6
categories:
  - 读书笔记
tag:
  - jfinal
abbrlink: 30885
---

> Controller/Service/Model类各司其职

接口对外暴露，一组接口就是用户手中的一个遥控器，每个接口对应一个按键。用户并不关心点击按键的低层操作。
按键调用Service中的方法业务逻辑，每个业务逻辑或一组业务逻辑都涉及到或多或少的Model类。从这个角度说，Service与Model构成了外观模式。
