---
title: 如何在springboot中使用@Autowire注解
comments: true
date: 2022-03-14 18:41:13
categories:
tags:
---



在springboot项目中，有一个非常常用的注解：@Autowired，它表示什么含义内，又是如何使用的呢？我们来小小的研究一下。

autowire，英文含义为"自动装配"，在 SpringBoot中，自动装配指的是将 Spring 容器中的 bean 自动的和我们需要这个 bean 的类组装在一起。

## 使用实例

首先我们创建基础的springboot项目，并创建一个接口/test以及一个组件类MyService，并在接口Controller层引入MyService，如下代码所示：

```java
import org.springframework.stereotype.Component;

@Component
public class MyService {

    public String show() {
        return "我在MyService中";
    }
}
```

```java
import com.springcloud.security.demo.service.MyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    MyService myService;

    @GetMapping("test")
    public String sayHello() {
        return myService.show();
    }
}
```

如上代码所示，我们使用@Autowired注解，初次之外，并没有编写其他任何代码来实例化MyService，我们运行程序，并请求接口来看看效果：

![image-20220314184505646](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220314184505646.png)

如上图，可以看到程序运行正常，并且MyService中的内容被成功的打印了出来。那么该MyService对象是如何实例化的呢？

这就引入了一个较大的概念：**依赖注入**。

关于依赖注入，某乎上有一个非常有意思的[例子](https://zhuanlan.zhihu.com/p/33492169)，大家可以看一下，有助于理解依赖注入要解决的是什么问题，大体策略是什么。

> 降低耦合，解决程序难以维护的问题。
>
> 通常的方式有：构造函数，属性或者工厂模式。

下面跟着代码介绍几种依赖注入的实现方式：构造方法注入，setter方法注入，接口注入。

#### 构造方法注入

![image-20220315085624873](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315085624873.png)

#### setter方法注入

![image-20220315085726037](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315085726037.png)

#### 接口注入

![image-20220315085830657](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315085830657.png)



## springboot中`@Autowired`使用方法

上述方法使用时，在idea中会有一个黄色波浪线提示：

![image-20220315091313729](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315091313729.png)

那么，什么才是推荐的注入方式呢？

springboot中推荐使用构造函数，setter方式来设置。

如下所示：

![image-20220315091457268](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315091457268.png)

![image-20220315091919837](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315091919837.png)