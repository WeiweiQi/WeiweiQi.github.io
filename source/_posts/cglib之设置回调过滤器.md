---
title: cglib之设置回调过滤器
comments: true
date: 2022-04-24 18:10:00
categories:
tags:
---

1

## 问题缘起

在学习开源框架[jfinal](https://jfinal.com/)的过程中，尤其是研究其拦截器的实现时，遇到AOP的问题，然后逐步引导着自己学习Java的动态代理，认识到一个强大的工具包：cglib。

在上一篇文章《[使用cglib创建Java代理以及调用的结果分析](https://bbs.huaweicloud.com/blogs/349036)》中，我们学习了cglib创建Java代理的实现方式，通过Enhancer来创建监听对象，从而对方法进行拦截。

如下为`main`方法中，对`Writer`类进行动态代理的过程。其中`WriterInterceptor`实现了`net.sf.cglib.proxy.MethodInterceptor`接口

```java
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(Writer.class);
enhancer.setCallback(new WriterInterceptor());
Writer writer = (Writer) enhancer.create(new Class[]{String.class}, new String[]{"洛叶飘"});
writer.doWork();
```

在学习cglib的过程中，遇到一个新的概念：回调函数，以及回调过滤器。

## 回调

Java中也有回调，但是笔者个人碰到回调这个词，第一个想到的是javascript中的回调，将**函数作为参数传递给另一个函数**：如下所示：

```javascript
function myDisplayer(some) {
  console.log(some)
}

function myCalculator(num1, num2, myCallback) {
  let sum = num1 + num2;
  myCallback(sum);
}

myCalculator(5, 5, myDisplayer);
```

而Java中的回调是怎么回事呢？

我们知道Java中参数不能传递函数，那么又是如何实现回调的呢？

如下代码是一种实现回调的逻辑：通过只有一个函数的接口，在对象中保存一个接口对象，在指定方法内部调用接口对象的方法，从而实现回调机制：

```java
package com.qw.callback;

public interface CallBackIn {
    public void callBackMethod();
}
```

```java
package com.qw.callback;

public class Test {
    private CallBackIn callBack;

    public void setCallBack(CallBackIn callBack) {
        this.callBack = callBack;
    }
    public void call() {
        callBack.callBackMethod();
    }

    public static void main(String[] args) {
        Test test = new Test();
        test.setCallBack(new CallBackIn() {
            @Override
            public void callBackMethod() {
                System.out.println("回调函数被执行啦...");
            }
        });
        test.call();
    }
}
```

执行结果：

```shell
回调函数被执行啦...
```

## cglib的回调过滤

借助cglib，可以实现给某个类的所有方法或部分方法设置回调函数，可以实现修改函数返回结果，添加过滤器等功能。

一个实现样例如下：

有要被过滤的类`Writer`，他它有三个方法，如下：

```java
package com.qw.cglib;

public class Writer {
    String name;

    public Writer(String name) {
        this.name = name;
    }

    public String doWork() {
        System.out.println(name + "在工作");
        return name + "在工作";
    }

    public String rest() {
        System.out.println(name + "在休息");
        return name + "在休息";
    }

    public String eat() {
        System.out.println(name + "在吃饭");
        return name + "在吃饭";
    }
}
```

回调过滤器的实现，如下，通过实现`net.sf.cglib.proxy.CallbackFilter`接口，其中的`accept`方法可以指定设置类的过滤数组时，某个方法在过滤数组中的索引：

```java
package com.qw.cglibfilter;

import net.sf.cglib.proxy.CallbackFilter;

import java.lang.reflect.Method;

public class TargetMethodCallbackFilter implements CallbackFilter {

    /**
     * @param method
     * @return 返回值为被代理类的各个方法在回调数组Callback[]中的位置索引
     */
    @Override
    public int accept(Method method) {
        System.out.println(method.getName());
        if (method.getName().equals("doWork")) {
            System.out.println("filter doWork == 0");
            return 0;
        }
        if (method.getName().equals("rest")) {
            System.out.println("filter rest == 1");
            return 1;
        }
        if (method.getName().equals("eat")) {
            System.out.println("filter eat == 2");
            return 2;
        }
        return 0;
    }
}

```

过滤器使用方式：

```java
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(Writer.class);
CallbackFilter callbackFilter = new TargetMethodCallbackFilter();
Callback callback1 = new TargetInterceptor();
Callback noop = NoOp.INSTANCE;
Callback fixedValue = new TargetResultFixed();
Callback[] callbacks = new Callback[]{callback1, noop, fixedValue};
enhancer.setCallbacks(callbacks);
enhancer.setCallbackFilter(callbackFilter);
Writer writer = (Writer) enhancer.create(new Class[]{String.class}, new String[]{"洛叶飘"});
System.out.println("----------------函数调用doWork-----------------");
String workResult = writer.doWork();
System.out.println("----------------函数调用rest-------------------");
String restResult = writer.rest();
System.out.println("----------------函数调用eat--------------------");
String eatResult = writer.eat();
System.out.println("------------------函数返回值-------------------");
System.out.println(workResult);
System.out.println(restResult);
System.out.println(eatResult);
```

上述代码中，`TargetInterceptor`是我们[上一篇文章](https://bbs.huaweicloud.com/blogs/349036)中的方法拦截器类，这里不再赘述。`NoOp`类表明什么操作也不做（可以看看下面的运行结果来体会一下），`TargetResultFixed`实现了`net.sf.cglib.proxy.FixedValue`接口，可以修改函数的返回值。

我们先来看看运行结果：

```
doWork
filter doWork == 0
rest
filter rest == 1
eat
filter eat == 2
equals
toString
hashCode
clone
----------------函数调用doWork-----------------
调用前
洛叶飘在工作
调用后
调用结果：洛叶飘在工作
----------------函数调用rest-------------------
洛叶飘在休息
----------------函数调用eat--------------------
锁定结果
------------------函数返回值-------------------
洛叶飘在工作
洛叶飘在休息
什么都不干
```



## 代码补充

`TargetResultFixed`类的代码：

```java
package com.qw.cglibfilter;

import net.sf.cglib.proxy.FixedValue;

public class TargetResultFixed implements FixedValue {

    @Override
    public Object loadObject() throws Exception {
        System.out.println("锁定结果");
        Object obj = "什么都不干";
        return obj;
    }
}
```

