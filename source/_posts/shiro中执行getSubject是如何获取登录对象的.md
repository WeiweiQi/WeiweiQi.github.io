---
title: shiro中执行getSubject是如何获取登录对象的
comments: true
date: 2022-04-08 22:51:54
categories:
tags:
---



## 沮丧

最近，生产环境中所使用的jfinal框架想要集成shiro，但是经过两天的摸索，目前始终无法解决jfinal无状态stateless情况下如何获取登录对象的问题，即使用TOKEN验证方式，如何在登录后根据token获取其登录对象的问题。

为此，今天我们深入研究一下在shiro框架中，执行getSubject方法时，到底程序做了些什么？

## shiro基础样例测试

为此，我们使用最简单的shiro测试代码来进行研究：

其Realm类如下：

```java
package com.xxx.test;

import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

import java.util.ArrayList;
import java.util.List;

public class Realm extends AuthorizingRealm {

    /**
     * 获取用户验证信息
     * @param authenticationToken 所需验证的token
     * @return null or 身份信息
     * @throws AuthenticationException 验证异常
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        token.getUsername();
        // 用户名
        Object principal = token.getPrincipal();
        // 密码
        Object credentials = token.getCredentials();
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(principal, credentials, getName());
        return simpleAuthenticationInfo;
    }


    //授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo info=new SimpleAuthorizationInfo();
        List<String> permissions=new ArrayList<>();
        List<String> roles=new ArrayList<>();
        String username= (String) principalCollection.getPrimaryPrincipal();
        permissions.add("xxx");
        roles.add("abc");
        info.addRoles(roles);//设置角色
        info.addStringPermissions(permissions);//设置权限
        return info;
    }
}

```

然后我们编写测试用例：

```java
import com.jfinal.kit.LogKit;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.config.IniSecurityManagerFactory;
import org.apache.shiro.realm.SimpleAccountRealm;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.Factory;
import org.junit.Assert;
import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ShiroTest {


    @Test
    public void testHelloworld() {
        //1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager
        Factory<org.apache.shiro.mgt.SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
        //2、得到SecurityManager实例 并绑定给SecurityUtils
        org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();
        SecurityUtils.setSecurityManager(securityManager);
        //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）
        Subject subject = SecurityUtils.getSubject();
        LogKit.info(subject.toString());
        UsernamePasswordToken token = new UsernamePasswordToken("zhang", "123");
        try {
            //4、登录，即身份验证
            subject.login(token);
            LogKit.info(subject.toString());
        } catch (AuthenticationException e) {
            //5、身份验证失败
        }
        Assert.assertEquals(true, subject.isAuthenticated()); //断言用户已经登录
        //6、退出
        subject.logout();
    }
}
```

在下面这行代码打上断点：

```java
Subject subject = SecurityUtils.getSubject();
```

执行测试，我们发现程序跳转到来了下面的方法体中：

```java
public static Subject getSubject() {
        Subject subject = ThreadContext.getSubject();
        if (subject == null) {
            subject = (new Builder()).buildSubject();
            ThreadContext.bind(subject);
        }

        return subject;
    }
```

继续深入：

```java
/**
* ThreadContext.class
*/
public static Subject getSubject() {
        return (Subject)get(SUBJECT_KEY);
    }
```

其中的`SUBJECT_KEY`值为：`org.apache.shiro.util.ThreadContext_SUBJECT_KEY`，我们进入get方法：

```java
public static Object get(Object key) {
        if (log.isTraceEnabled()) {
            String msg = "get() - in thread [" + Thread.currentThread().getName() + "]";
            log.trace(msg);
        }

        Object value = getValue(key);
        if (value != null && log.isTraceEnabled()) {
            String msg = "Retrieved value of type [" + value.getClass().getName() + "] for key [" + key + "] bound to thread [" + Thread.currentThread().getName() + "]";
            log.trace(msg);
        }

        return value;
    }
```

继续深入：

```java
private static Object getValue(Object key) {
        Map<Object, Object> perThreadResources = (Map)resources.get();
        return perThreadResources != null ? perThreadResources.get(key) : null;
    }

```

最终，我们发现subject对象来自一个map对象中，subject的key为``org.apache.shiro.util.ThreadContext_SUBJECT_KEY`，我们看一下resources中存了什么：

```java
private static final ThreadLocal<Map<Object, Object>> resources = new ThreadContext.InheritableThreadLocalMap();
```

该map是一个ThreadLocal修饰的线程局部对象。

我们发现其执行结果返回为null:

![image-20220408231014621](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220408231014621.png)

然后逐层返回，便返回到下面这一行：

![image-20220408231131671](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220408231131671.png)

构建对象函数如下：

![image-20220408231357704](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220408231357704.png)

具体到方法内部：

```java
public Subject createSubject(SubjectContext subjectContext) {
        SubjectContext context = this.copy(subjectContext);
        context = this.ensureSecurityManager(context);
        context = this.resolveSession(context);
        context = this.resolvePrincipals(context);
        Subject subject = this.doCreateSubject(context);
        this.save(subject);
        return subject;
    }
```



我们再来看看绑定bind：

```java
public static void bind(Subject subject) {
        if (subject != null) {
            put(SUBJECT_KEY, subject);
        }

    }
```

如何便在局部线程内部，将subject保存下来。



## 总结

关键思想：线程局部变量ThreadLocal，生成subject与绑定分开执行。