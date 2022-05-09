---
title: shiro-一个开源的安全服务框架
comments: true
date: 2022-04-01 21:40:05
categories:
tags:
---

1

## 起源

最近，工作环境要求引入权限管理系统，提出了四个可能的方案，大致是：

第一种：自我设计与实现；

第二种：参考现有较为成熟的框架，如若依系统中的spring-security，或开源的shiro。

第三种：参考现有系统，复制其数据表，直接在其权限框架下做业务；

第四种：其他。

本文就来自于我对shiro的调研情况。

## shiro是什么

shiro，官网地址：https://shiro.apache.org/，从其官网地址不难猜出，其是apache基金会下的一个开源项目。

根据其介绍，Shiro是一个功能强大且易于使用的Java安全框架，它执行身份验证、授权、加密和会话管理。

废话少说，看代码！



```java
@Test
public void testHelloworld() {
    //1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager
    Factory<org.apache.shiro.mgt.SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
    //2、得到SecurityManager实例 并绑定给SecurityUtils
    org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);
    //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("zhang", "123");
    try {
        //4、登录，即身份验证
        subject.login(token);
    } catch (AuthenticationException e) {
        //5、身份验证失败
    }
    Assert.assertEquals(true, subject.isAuthenticated()); //断言用户已经登录
    //6、退出
    subject.logout();
}
```



这个验证的例子是官网以及一个博主发的例子，其中我们将配置文件`shiro.ini`配置为以下内容：

```ini
#[main]
realm=com.xxx.test.Realm
securityManager.realm=$realm
```

对应的Realm文件内容：

```java
package com.holdoa.test;

import com.holdoa.core.model.SysUser;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

public class Realm extends AuthorizingRealm {


    //这个方法是用来授权的
    //查询登陆人是否有权限时就查询这个  如果设置了缓存,只会查一次
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
//        Object user = principalCollection.getPrimaryPrincipal();
//        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
//        return info;
        return null;
    }

    /**
     * 获取用户验证信息
     * @param authenticationToken 所需验证的token
     * @return null or 身份信息
     * @throws AuthenticationException 验证异常
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 断点位置
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        token.getUsername();
        // 用户名
        Object principal = token.getPrincipal();
        // 密码
        Object credentials = token.getCredentials();

        // TODO 执行数据库数据获取与算法认证
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(principal, credentials, getName());
        return simpleAuthenticationInfo;
    }
}

```

经过运行，我们发现代码成功的在Realm第二个方法被断点解惑，从而我们可以在这里嵌入我们数据库的以及特定算法要求来验证登录是否正确，很简单吧！

## 说回四个方案

文章开头提到的四种方案，我个人倾向于“第一种+第三种”，借鉴若依框架的实现逻辑，结合现有数据库结构来实现。

现有的框架前后端分离，权限管理系统首先要做满足的一点是可以通过纯后台的配置来修改权限，而不需要前端做修改，这需要将前端页面的路由信息动态生成，即：用户登录 -> 获取用户角色 -> 返回**用户权限**-> 返回用户路由列表。

其中，“用户权限”一方面控制用户路由，另一方面控制每个路由页面上的按钮的显示情况。







