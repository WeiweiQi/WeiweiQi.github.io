---
title: jfinal4-8中配置shiro-filter失败的问题研究——undertow的filter配置方式不同
comments: true
date: 2022-04-09 21:19:44
categories:
tags:
---



> 做难事必有所得。——金一南

## 两个样例的基础

在我们学习了jfinal-shiro-jwt项目，以及jfinal-shiro-plugin项目后，我们对jfinal如何嵌入shiro有了一个较为清晰但是实际模糊的感觉，一切还是要自己动手实现来的实际，深入！

实际上jfinal-shiro-jwt项目已经给我们了一个很好的无状态样例，但是jfinal-shiro-plugin中有一个很好的地方，那就是他支持shiro中的注解。我们可以用类似下面的语句来控制接口权限：

```java
@RequiresRoles("abc")
	public void abc() {
		renderAppMsg("接口访问成功");
	}
```

其中的语句：`@RequiresRoles("abc")`表示需要当前登录人拥有角色`abc`才可以访问当前接口。

接下来，我们逐步尝试探索将两者的优点结合起来，既能满足使用token进行无状态登录，又能很好地支持shiro注解。



## 自定义Realm

我们借鉴使用jfinal-shiro-jwt中的ShiroDbRealm:

```java
package com.xxx;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

public class ShiroDbRealm extends AuthorizingRealm{

	
	/**
	 * 重写shiro的token
	 */
	@Override
	public boolean supports(AuthenticationToken token) {
		return token instanceof JWTToken;
	}

	/**
	 * 角色,权限认证
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		//String username = JwtUtils.getUsername(principals.toString());
		SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
		//这里可以连接数据库根据用户账户进行查询用户角色权限等信息,为简便,直接set
		simpleAuthorizationInfo.addRole("admin");
		simpleAuthorizationInfo.addStringPermission("all");
		return simpleAuthorizationInfo;
	}
	
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
		//TODO 根据解密的token得到用户名到数据库查询(为省事,直接设置)
        if(JwtUtils.verifyJwt(token, userName) == null) {
        	throw new AuthenticationException("用户名或者密码错误");
        }
		return new SimpleAuthenticationInfo(token, token, getName());
	}

}

```

需要注意的时，ShiroDbRealm中的后两个方法，第一个返回的是AuthorizationInfo，是做权限授权的，第二个返回的是AuthenticationInfo，是做登录认证的。

## Controller中的接口

我们在测试Controller中设置了三个接口，具体代码如下：

```java
	@Clear
	@Before(MyShiroInterceptor.class)
	public void noLogin() {
		renderAppError("请登录");
	}

	@Clear
	@Before(MyShiroInterceptor.class)
	public void testLogin() {
		String name = getPara("name");
		String password = getPara("password");
		// TODO 判断密码与用户名是否正确
		if ("admin".equals(name)) {
			Map<String,String> map = new HashMap<>();
			map.put("name", name);
			String token = JwtUtils.createJwt(map, new Date(System.currentTimeMillis()+360000));
			renderAppJson(new Record().set("token", token));
		} else {
			renderAppError("用户名与密码错误");
		}
	}

	@Clear
	@Before(MyShiroInterceptor.class)
	public void testAfterLogin() {
		renderAppMsg("我已经登录了");
	}
```

这三个接口分别表示：

/login/noLogin: 登录验证失败，返回错误信息“请登录”，即在JWTFilter中使用代码配置的接口。

/login/testLogin: 登录接口，根据用户名与密码，获取登录token。

/login/testAfterLogin: 测试登录是否成功的接口。

我们尝试运行，发现无论怎么配置，包括在web.xml中配置始终无法像jfinal-shiro-jwt中一样，执行到JWTFilter。

我们查找项目与jfinal-shiro-jwt的区别：

1. 所使用的jfinal版本不同，我们所使用的jfinal版本我4.8，而jfinal-shiro-jwt中使用的版本是3.6。因为其版本相比我们低，所以我们尝试将jwt项目中的版本升级到4.8，之后发现jwt仍然可以正常执行到过滤器中。

2. 所使用的shiro版本不同，我们所使用的的shiro为1.9.0，而jwt中使用的是1.4.0，我们尝试给jwt升级shiro版本，之后发现其仍然可以正常运行。

3. 除版本号外，我们发现两者的启动方式不同，jfinal 4.8中，我们的启动方式：

   ```java
   UndertowServer.start(XXXConfig.class);
   ```

   而jwt项目中的启动方式为jetty:

   ```java
   JFinal.start("src/main/webapp", 8088, "/", 5);
   ```

   将我们系统中的启动方式修改为jetty后~重要发现Filter中拦截到了请求信息。

   

## 总结

最终，我们发现其配置的Filter没有执行到，是因为undertow中配置filter不是通过web.xml配置。



   



