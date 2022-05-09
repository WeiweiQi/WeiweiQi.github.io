---
title: 使用cglib创建Java代理
comments: true
date: 2022-04-21 17:53:08
categories:
tags:
---

## 问题起源

在最近的工作中，AOP如何实现的问题一直困扰着笔者，奈何工作繁重，一直没有时间学习了解这一块。

这一次，趁着工作上使用shiro的风，顺着shiro注解的使用过程，我们来逐步了解了注解，自定义注解的实现，Java反射，以及在上一篇文章《[从使用Java代理的极简代码看Java代理逻辑](https://bbs.huaweicloud.com/blogs/348852)》中，我们学习了Java的代理。顺着Java代理的学习路线，我们了解到有一个非常遍历的工具包：cglib。

## cglib的基础原理

对于cglib的基础原理，我们暂不做深究，但是可以大概概况为：使用字节码处理框架ASM，动态地生成所要代理类的一个子类，子类中重写类的所有非final方法，从而在子类中拦截父类方法，插入相关逻辑代码。

## cglib的应用

我们以java的maven项目为例，来看看如何使用cglib的包。

cglib的mvn包分为两个:cglib与cglib-nodep，我们可以在mvn仓库中搜索到，cglib-nodep内部包含asm的类，不需要再额外引入，通常我们使用这个包，使用方式如下：

```xml
<!-- https://mvnrepository.com/artifact/cglib/cglib-nodep -->
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib-nodep</artifactId>
    <version>3.3.0</version>
    <scope>test</scope>
</dependency>

```

另外，我们惊喜的发现jfinal中也使用了cglib包，相信我们距离jfinal拦截器的实现又接近了一大步。

![image-20220421195423922](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220421195423922.png)

### 实现过程

如下，我们有想要被代理的类

```java
package com.qw.cglib;

public class Writer {
    String name;

    public Writer(String name) {
        this.name = name;
    }

    public void doWork() {
        System.out.println(name + "在工作");
    }
}
```

方法拦截器类，实现cglib中的接口`MethodInterceptor`：

```java
package com.qw.cglib;

import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class WriterInterceptor implements MethodInterceptor {

    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("方法调用前");
        Object result = methodProxy.invokeSuper(o, objects);
        System.out.println("方法调用后");
        System.out.println(result);
        return result;
    }
}

```

其中有一点，需要我们观测一下，我们想要监测的方法是`doWork`，它的返回值是`void`，我们观察一下`result`的输出结果。

测试类：

```java
package com.qw.cglib;

import net.sf.cglib.proxy.Enhancer;

public class TestWriter {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(Writer.class);
        enhancer.setCallback(new WriterInterceptor());
        Writer writer = (Writer) enhancer.create(new Class[]{String.class}, new String[]{"洛叶飘"});
        writer.doWork();
    }
}
```

执行结果：

```console
方法调用前
洛叶飘在工作
方法调用后
null
```

成功的完成了对方法的监控，并插入了相关代码。

### 注意invokeSuper的返回值

其中，不难注意到，`void`返回值的打印结果是`null`。那么，如果返回值为`null`的，其反射调用结果是多少呢？

我们修改一下`doWork`方法：

```java
public String doWork() {
        System.out.println(name + "在工作");
        return null;
    }
```

其他部分代码不变，重新执行，结果如下：

```java
方法调用前
洛叶飘在工作
方法调用后
null
```

如此，即无论返回值为`void`，或者实际返回的`null`，反射方法调用的返回结果均为`null`。

