---
title: 了解完代理后你应该学习的——面向切面编程AspectJ
comments: true
date: 2022-04-25 18:35:47
categories:
tags:
---

## 问题起源

学习了Java的代理，动态代理，cglib的小伙伴对Java的代理中的一些概念应该会有一些基础的认识，比如如何使用代理实现一个拦截器，如果通过cglib的回调过滤器来修改方法的执行逻辑等等，那么这种实现方式是否可以抽象为更高级的编程思想呢？使用cglib创建对象的过程与代码很繁琐，是否有更便捷的开源包可以使用呢？

## AOP

AOP：面向切面编程，其思想是：

> 通过预编译方式和运行期动态代理方式，实现在不修改源代码的情况下给程序动态统一添加额外功能的一种技术

我们今天要学习的AspectJ就是AOP思想的一个工具包，定义了AOP语法与基本概念。

## AspectJ的一些基本概念

1. 连接点：JoinPoint：

2. 切入点：PointCut；

3. 通知：Advice；

4. 切面：Aspect。

   其[官方文档](https://www.eclipse.org/aspectj/doc/released/progguide/starting-aspectj.html#the-dynamic-join-point-model)释义如下：

   > A *join point* is a well-defined point in the program flow. A *pointcut* picks out certain join points and values at those points. A piece of *advice* is code that is executed when a join point is reached. These are the dynamic parts of AspectJ.

其含义如下图所示：

![image-20220425184930262](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220425184930262.png)

## 从实践中学习

让我们从实际代码触发来理解这几个概念。

### maven引入

使用aspectj需要我们引入以下两个maven包：

```xml
<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjrt -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjrt</artifactId>
    <version>1.9.9.1</version>
    <scope>runtime</scope>
</dependency>

<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjweaver -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.9.1</version>
</dependency>
```

第一个aspectjrt是aspectj运行时需要的库(Runtime Library)，第二个aspectjweaver，支持切入点表达式，用于在加载Java类时起作用。

### 简单使用

（在学习的过程中，有个东西始终让我无法习惯，就是在java中引入`.aj`文件）

需要习惯这一点，在非spring项目中，使用aspectj可能需要修改maven文件与创建非`.java`文件。不过，现在的编译器可以帮助我们习惯这一点，maven引入aspectj之后，IDEA便有了创建aspectj文件的选项：

![image-20220426190524717](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220426190524717.png)

最开始，我们有以下类：

```java
package com.qw.real.aop;

public class Person {

    /**
     * 读书
     * @return
     */
    public boolean readBook(String book) {
        System.out.println("正在读" + book);
        return true;
    }
}
```

然后创建aspectj文件：

```java
public aspect AjAspect {
    pointcut say():
            execution(* App.say(..));
    before(): say() {
        System.out.println("AjAspect before say");
    }
    after(): say() {
        System.out.println("AjAspect after say");
    }
}
```

### 配置aspectj进行编译执行

使用aspectj与其他java程序最大的不同是，需要特殊编译环境，我们以idea为例，除需要在maven中引入之前的两个aspectj运行环境，还需要引入一个aspectj编译器：

```xml
<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjtools -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjtools</artifactId>
    <version>1.9.9.1</version>
</dependency>

```

我们配置Java Compiler，测试：

![image-20220427083638107](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220427083638107.png)

这个错误似乎是在说我们的编译环境与运行环境所使用的版本不一致：编译用version 55，而运行使用的是 version 52，猜测可能是因为我们使用的最新的aspect包，为此，降低aspectj版本到1.8.3再次尝试：

![image-20220427083842832](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220427083842832.png)

测试成功！

然后我们去执行：

```shell
before...
正在读古文观止
after...
```

完结，鼓掌！

## 总结

总的来看，aspectj非常强大，但是其需要特殊配置编译环境这一点可能不太能被人接受。
