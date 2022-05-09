---
title: 借鉴jfinal-shiro-plugin在jfinal中嵌入shiro并支持注解
comments: true
date: 2022-04-16 11:19:18
categories:
tags:
---



## 对于支持注解的强迫症

在上一篇文章[jfinal中stateless模式嵌入shiro验证](https://bbs.huaweicloud.com/blogs/347153)中我们已经成功嵌入了shiro，但是呢，有个小缺陷，并没有支持shiro的注解，例如，如下方式并不能触发权限验证：

```java
@RequiresPermissions("all")
public void test() {
    renderText("测试");
}
```

在我们看来，以及在《Effective Java》的作者看来，注解都是非常优雅的一种实现方式。如果不使用注解，要实现上述代码的功能，需要怎么做呢？

## 不使用注解的方式

如果不使用注解，就需要我们在代码中具体指明其执行逻辑，就上面的例子来说，没有注解而具有同样功能的代码如下：

```java
	public void test() {
		Subject s = SecurityUtils.getSubject();
		s.checkPermission("all");
		renderText("测试");
	}
```

即需要我们手动的来获取对象以及执行对象的检查权限方法。

## 对于shiro注解的支持

这里我们找到了jfinal-shiro-plugin是支持注解的，因此，首先我们按照jfinal-shiro-plugin的方式，将其所有代码搬移过来。（在文章[jfinal中stateless模式嵌入shiro验证](https://bbs.huaweicloud.com/blogs/347153)中已经阐述了搬移的原因：即jfinal4.8对于jfinal-shiro-plugin无法兼容，执行报错）

在搬移了其源码后，首先按照jfinal-shiro-plugin的方式，在程序入口进行配置，包括拦截器与插件，具体代码如下：

```java
/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
        // 这里可能还会有别的拦截器
		me.add(new ShiroInterceptor());
	}
```

配置插件：

```java
/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {

		// 这里可能还会有数据库，redis，定时等插件
		Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
		org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();
		SecurityUtils.setSecurityManager(securityManager);

		ShiroPlugin shiroPlugin = new ShiroPlugin(this.routes);
		me.add(shiroPlugin);
	}
```

上面代码中shiroPlugin构造函数中的routes需要我们对程序入口做一点小小的改造：

```java
Routes routes = null;

/**
	 * 配置路由
	 */
	public void configRoute(Routes me) {
		
        me.add("/", IndexController.class, "/index");
        // 其他路由
		this.routes = me;
	}
```

## 核心：每次调用首先执行subject.login()

需要对shiro的拦截器做一点小小的修改：

```java
public void intercept(Invocation ai) {
    	/////////////////自己添加的代码
		String token = ai.getController().getHeader("token");
		if (StrKit.notBlank(token)) {
			Subject s = SecurityUtils.getSubject();
			JWTToken jwtToken = new JWTToken(token);
			s.login(jwtToken);
		}
    	//////////////////

		AuthzHandler ah = ShiroKit.getAuthzHandler(ai.getActionKey());
		// 存在访问控制处理器。
		if (ah != null) {
			Controller  c = ai.getController();
			try {
				// 执行权限检查。
				ah.assertAuthorized();
            }
        }
    	// 这里省略了ShiroInterceptor的其他代码
}
```

我们首先在拦截器入口添加一个获取token已经调用shiro登录的方法，以便后续shiro能够成功的获取到当前登录对象，以及做权限验证等等。

这里的验证方式完全可以自定义，我们所使用的方式是登录的时候获取完全随机的token串，并将其设置到redis中，每次验证登录，从redis中根据token获取对象信息。

当然，也可以参考JWT方式，对登录人信息加密与解密来获取用户信息。

