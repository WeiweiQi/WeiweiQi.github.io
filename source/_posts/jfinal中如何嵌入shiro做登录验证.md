---
title: jfinal中如何嵌入shiro做登录验证
comments: true
date: 2022-04-02 09:32:53
categories:
tags:
---

1

## 起源

最近要学习使用shiro做后端接口的权限校验，生产环境目前使用的开源框架jfinal，本文我们将来看看如何在jfinal中实现shiro嵌入与使用。

## 当前环境jfinal版本

目前使用的jfinal版本为：4.8。

```xml
<dependency>
    <groupId>com.jfinal</groupId>
    <artifactId>jfinal</artifactId>
    <version>4.8</version>
</dependency>
```

## maven引入shiro

在网站https://shiro.apache.org/download.html 中我们可以查看到所有可用的shiro maven配置，我们首先尝试使用`shiro-web`，即引入：

```xml
<dependency>
  <groupId>org.apache.shiro</groupId>
  <artifactId>shiro-web</artifactId>
  <version>1.9.0</version>
</dependency>
```

按照官网示例，我们在resources目录下，创建文件shiro.ini，配置以下内容：

```ini
#[main]
realm=com.yourpackage.Realm
securityManager.realm=$realm
```

实现我们自己的Realm类。

```java
package com.youpackage.test;

import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

import java.util.ArrayList;
import java.util.List;

public class Realm extends AuthorizingRealm {

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //认证的实体信息, 可以放对象,以后可以随时取出来用。
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        // 用户名
        Object principal = token.getPrincipal();
        // 密码
        Object credentials = token.getCredentials();
        // TODO 执行数据库数据获取与算法认证
        //封装一个带数据的对象,Shiro会拿这个对象和传进来的Token的密码进行对比,验证是否登录成功
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(principal, credentials, token.getName());
        return simpleAuthenticationInfo;
    }


    //这个方法是用来授权的
    //查询登陆人是否有权限时就查询这个  如果设置了缓存,只会查一次
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo info=new SimpleAuthorizationInfo();
        List<String> permissions=new ArrayList<>();
        List<String> roles=new ArrayList<>();
        String username= (String) principalCollection.getPrimaryPrincipal();
        permissions.add("sys:test:user");
        roles.add("abc");
        info.addRoles(roles);//设置角色
        info.addStringPermissions(permissions);//设置权限
        return info;
    }
}

```

第二个方法我们先放一放，首先来看第一个方法，该方法是用来获取用户验证信息。我们需要嵌入自己数据库的密码验证逻辑。其中的token对象我们通过获取getPrincipal与getCredentials我们可以获取到用户登录的用户名与密码。

> principals，身份，主体的标识，如用户名，邮箱，电话等。
>
> credentials，证明/凭证，只有主体知道的安全值，如密码，数字整数。

在登录接口中我们实现代码如下：

```java
// XXXController.java中

@Clear(AuthInterceptor.class)
public void shiroLogin() {
    Subject currentUser = SecurityUtils.getSubject();
    String username = getPara("usename");
    String password = getPara("password");
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);
    // 调用此行代码时，会调用到Realm中继承的第一个方法。
    currentUser.login(token);
    // 还需要返回给前端token
    renderAppMsg("登录成功");
}
```

这段代码首先排除验证器，因为登录之前肯定是没有验证的。

然后在接口内部获取用户名与密码，构造UsernamePasswordToken对象，调用Subject.login进行登录，从而自动进行用户名密码验证。

另外，我们需要在jfinal环境中配置Security Manager。在jfinal程序入口，在其方法configPlugin中进行以下配置：

```java
Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();
SecurityUtils.setSecurityManager(securityManager);
```

如此，便可以通过接口登录，并使用shiro的验证机制，并嵌入自己的用户名，密码验证算法。





