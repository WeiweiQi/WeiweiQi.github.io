---
title: jfinal中stateless模式嵌入shiro验证
comments: true
date: 2022-04-15 20:34:00
categories:
tags:
---

1

## 问题起源

在前些天的文章中，我们了解到困惑了我们好几天的问题是由于jfinal新版中使用undertowServer方式启动，其嵌入filter的方式有变动，所以导致网上检索到的通过web.xml嵌入filter失败。

在不考虑修改undertowServer的情况下，也就意味着我们需要找到一种在undertowServer环境下，嵌入shiro的方式。

今天，我们就来尝试一种通过拦截器来实现的Stateless Jfinal 嵌入方式。

## Stateless的理解

个人对Stateless的理解就是前后端分离，两次请求互相独立，通过约定的token等内容判断是否是同一个用户。

因此这要求，登录接口需要给用户生成一个随机的token，以便用户后续访问的时候带上。

## 登录接口

登录接口首先需要我们访问数据库，以及通过特定算法来验证用户名与密码是否匹配。如果匹配，则生成随机的字符串，即token，并保存在redis中，注意，映射关系是token为key，value为用户信息，可以是用户名，也可以是用户id等用户唯一标识。

```java
@Clear
public void Login() {
    String name = getPara("name");
    String password = getPara("password");
    if ("admin".equals(name)) { // TODO 判断密码与用户名是否正确
        Cache cache = Redis.use();
        String token = StrKit.getRandomUUID();
        cache.set("TOKEN:" + token, name);
        renderText(token);
    } else {
        renderText("用户名与密码错误");
    }
}
```

另外，需要注意的有两点：

1. 接口前调用@Clear，即登录接口不应该被拦截验证
2. 系统的登录接口，与shiro中的subject.login应该注意区分，是两个不同的概念。

## 自定义拦截器

```java
package com.holdoa.core.interceptor;

import com.holdoa.core.controller.BaseController;
import com.holdoa.core.filter.JWTToken;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.kit.LogKit;
import com.jfinal.kit.StrKit;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.aop.MethodInvocation;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.aop.AnnotationsAuthorizingMethodInterceptor;
import org.apache.shiro.subject.Subject;

import java.lang.reflect.Method;

public class MyShiroInterceptor extends AnnotationsAuthorizingMethodInterceptor implements Interceptor {
	 
    public MyShiroInterceptor() {
        getMethodInterceptors();
    }
 
    public void intercept(final Invocation inv) {
        try {
            String token = inv.getController().getHeader("token");
            if (StrKit.isBlank(token)) {
                BaseController b = (BaseController) inv.getController();
                b.renderAppError("缺少token");
                return;
            } else {
                Subject s = SecurityUtils.getSubject();
                JWTToken jwtToken = new JWTToken(token);
                s.login(jwtToken);
                inv.invoke();
            }
        } catch (Throwable e) {
            if (e instanceof AuthorizationException) {
                doProcessuUnauthorization(inv.getController());
            }
            LogKit.warn("权限错误:", e);
            try {
                throw e;
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        }
    }
 
    /**
     * 未授权处理
     *
     * @param controller controller
     */
    private void doProcessuUnauthorization(Controller controller) {
        controller.redirect("/login/noLogin");
    }
}


```

上面的代码很长，我们重点看其中的这几行：

```java
String token = inv.getController().getHeader("token");
if (StrKit.isBlank(token)) {
    BaseController b = (BaseController) inv.getController();
    b.renderAppError("缺少token");
    return;
} else {
    Subject s = SecurityUtils.getSubject();
    JWTToken jwtToken = new JWTToken(token);
    s.login(jwtToken);
    inv.invoke();
}
```

逻辑可以描述为：获取token，若不为空，将其转换为JWTToken对象，然后调用shiro的登录接口：`s.login(jwtToken)`。

而shiro的login方法会触发自定义Realm中的验证接口：

```java
/**
	 * 自定义认证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken auth) throws AuthenticationException {
		String token = (String) auth.getCredentials();
		 // 解密获得username，用于和数据库进行对比
        String userName = JwtUtils.getUsername(token);
        if (userName == null || userName == "") {
            throw new AuthenticationException("token 校验失败");
        }
		return new SimpleAuthenticationInfo(token, token, getName());
	}

```

其中，JwtUtils。getUsername的具体代码如下，和设置token是对应的：

```java
/**
     * @return token中包含的用户名
     */
    public static String getUsername(String token) {
		Cache cache = Redis.use();
		String username = (String)cache.get(RedisKeyPreFix.NEW_OA_MANAGE_TOKEN_PREFIX + token);
		return username;
    }
```

如此，便做到了shiro的嵌入。



## 遗留问题

目前欠缺的一个问题是，不能实现shiro的注解来进行权限验证，这个问题我们还准备借助ShiroPlugin来实现，由于jfinal已经升级到4.8了，而shiroPlugin目前还停留在支持jfinal 3.x的版本，所以需要我们下载jfianl-shiro-plugin源码做一些修改。