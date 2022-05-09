---
title: 巧用ThreadLocal规避层层传值
comments: true
date: 2022-04-27 09:38:48
categories:
tags:
---

## Web开发中的一点麻烦事

最近，准确地说，是一直都有的一点麻烦事：函数层层传递。什么意思呢？比如说有个很常见的需求描述是：记录用户的某次操作明细。

以在Java的开源框架jfinal中，操作添加一个用户的接口为例，有：

```java
public class XXController() {
    public void addUser() {
        // 获取操作人
        Integer opUserId = Integer.parseInt(getHeader("opUserId"));
        // 获取其他参数...
        
        service.addUser(...., opUserId);
        renderAppMsg("添加用户成功");
    }
}
```

为了记录用户添加的具体操作内容以及信息错误，这个记录用户操作的记录可能需要穿透好层方法。

```java
public class XXService() {
    public void addUser(String tel, String name, String password, Integer opUserId) {
       	checkTel(tel, opUserId);
        
        checkName(name, opUserId);
        
       	checkPassword(password, opUserId);
    }
    
    public void checkTel(String tel, Integer opUserId) {
        check(tel, opUserId);
    } 
    
    publc void check(..., Integer opUserId) {
        // ...
    }
}
```

举得这个例子或许不是很恰当，但是相信大家可以理解这个麻烦点在哪里。

函数调用链中的每个方法并不是需要这个参数，而可能仅仅是为了向下个被调用的函数传递这个参数。

那么是否有方法帮助我们来不需要这样逐层传递，从而获取接口请求参数的方法呢。

## 思考

这有点类似与一个全局变量，但是这个变量对每次请求来说是变化的，那么是否有一种方式能够让我们来保存这样一种：**针对每次请求的全局变量**呢？

在最近学习Shiro的过程中，以及学习若依开源框架的过程中，我们发现其均使用到了一个强大的Java类：ThreadLocal。

shiro使用ThreadLocal是用来保存当前登录对象，若依框架中，其中所使用的分页插件PageUtil使用ThreadLocal保存请求参数中的pageNum与pageSize等分页参数。因此我们是不是也可以使用ThreadLocal来达到同样的目的。

## 在拦截器中使用ThreadLocal暂存请求参数

为此，我们来尝试一下，通过ThreadLocal保存请求参数，通过拦截器我们可以拦截每次请求，如下是实现方式：

```java
package com.holdoa.core.interceptor;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

import javax.servlet.http.HttpServletRequest;

public class RequestPool implements Interceptor {

    public static ThreadLocal<HttpServletRequest> localRequest= new ThreadLocal<>();

    @Override
    public void intercept(Invocation inv) {
        localRequest.set(inv.getController().getRequest());
        inv.invoke();
        localRequest.remove();
    }

    public static HttpServletRequest getRequest() {
        return localRequest.get();
    }
}

```

我们通过ThreadLocal将整个请求暂存起来，当然，为了节约内存，也可以只保存使用频次高的通用参数，比如当前登录人的信息等等。

使用时，只需要我们通过这个线程局部变量取值即可：

```java
String para = RequestPool.localRequest.get().getParameter("username");
```

如此，我们便可以在处理每次请求的过程中，无需从Controller以及Service中的方法层层传值，只需要直接通过该局部变量取值即可。



