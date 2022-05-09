---
title: 开源项目Jfinal-shiro-jwt-shiro验证失败跳转位置代码优先还是配置优先
comments: true
date: 2022-04-09 16:10:55
categories:
tags:
---



## 寻觅

最近几天一直在寻找jfinal+shiro的结合方式，特别是适配自定义的token验证方式，自然是希望能找到已经开源的项目，其次再说自我实现代码。

## 关于shiro

官方地址：https://shiro.apache.org/

有些文档还是需要读一读的：

1. 官方文档：https://shiro.apache.org/documentation.html
2. infoQ介绍文章：https://www.infoq.com/articles/apache-shiro/

## jfinal-shiro-jwt

jwt，JSON WEB TOKEN验证，目前我们使用该种方式进行身份验证。另外在框架管理系统发展中，希望能嵌入后端的权限管理，所以最近看上了shiro。所以一直在寻觅jfinal+shiro的最佳组合方式。

前些天看了看jfinal-shiro-plugins，是使用拦截器来实现的。

同事发现网上有一个jfinal-shiro-jwt的项目，或许对实现权限管理有所帮助，因此来学习研究一番。

项目地址：https://github.com/perfree/Jfinal-shiro-jwt

保险起见，我把它复制了一份在gitee中：https://gitee.com/wieweicoding/Jfinal-shiro-jwt

clone到本地：

```shell
git clone https://gitee.com/wieweicoding/Jfinal-shiro-jwt
```

然后使用IDE打开项目，等待编译完成。目录结果如下图所示：

![image-20220409164117488](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220409164117488.png)

除jfinal常规的Controller，程序入口以及配置外，shiro相关的类包括：ShiroDbRealm，ShiroInterceptor，JWTFilter。token转换相关的类包括JWTToken，JwtUtils。

TestController中有三个接口，如下：

```java
package com.perfree.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.jfinal.core.Controller;
import com.perfree.common.AjaxResult;
import com.perfree.jwt.JwtUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;

/**
 * 测试Controller
 * @author Perfree
 */
public class TestController extends Controller{

	/**
	 * 首页
	 */
	public void index() {
		renderText("这是首页");
	}
	
	/**
	 * 登录页
	 */
	public void login() {
		renderText("请登录");
	}
	
	/**
	 * 登录操作
	 */
	public void doLogin() {
		try {
			String name = getPara("name");
			String password = getPara("password");
			if(name.equals("perfree") && password.equals("123456")) {
				Map<String,String> map = new HashMap<>();
				map.put("name", name);
				renderJson(new AjaxResult(AjaxResult.SUCCESS, JwtUtils.createJwt(map, new Date(System.currentTimeMillis()+360000))));
			}else {
				renderJson(new AjaxResult(AjaxResult.ERROR,"用户名或密码错误"));
			}
		} catch (Exception e) {
			renderJson(new AjaxResult(AjaxResult.FAILD,"系统异常"));
		}
	}
}

```



我们看一下shiro.ini的文件内容：

```ini
[main]
#realm  自定义realm 
shiroDbRealm=com.perfree.shiro.ShiroDbRealm
securityManager.realms = $shiroDbRealm
sessionManager=org.apache.shiro.session.mgt.DefaultSessionManager    
securityManager.sessionManager=$sessionManager
securityManager.sessionManager.sessionValidationSchedulerEnabled = false
# 退出跳转路径
logout.redirectUrl = /login
[filters]
app_authc = com.perfree.jwt.JWTFilter
app_authc.loginUrl  = /login
# 登录成功跳转路径 可以自己定义
app_authc.successUrl = /index

#路径角色权限设置
[urls]
/login = anon
/doLogin = anon
/resources/** = anon
/logout = logout
/** = app_authc,roles[admin]
```

这里我们说一下路径角色权限设置的含义：

anon：表示无需认证即可访问，即允许匿名访问。

authc：需要认证才可访问。

user：点击“记住我”功能可访问。

其实这些含义表示这些访问路径指定了过滤器，如anon表示指定了过滤器为AnonymousFilter。

同样的，`app_authc`也对应了在配置文件上半部分配置的过滤器：

```ini
[filters]
app_authc = com.perfree.jwt.JWTFilter
app_authc.loginUrl  = /login
# 登录成功跳转路径 可以自己定义
app_authc.successUrl = /index
```



## 运行测试

我们将项目运行起来，程序入口为`com.perfree.Main.class`

首先，我们尝试访问`/index`接口，如下图为postman访问测试：

![image-20220409203048932](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220409203048932.png)

接口没有返回预期的内容，而是返回了“请登录”三个字，这似乎是下面login接口的返回内容，这是怎么一回事呢？

我们可以从配置行`/** = app_authc,roles[admin]`得到一些启发。而其对应的配置中有`app_authc.loginUrl  = /login`，那么是否跟这个有关呢？

再让我们看一下这个过滤器的具体内容：

```java
package com.perfree.jwt;

import java.io.IOException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter;

/**
 * 自定义Shiro的过滤器
 * @author Perfree
 *
 */
public class JWTFilter extends BasicHttpAuthenticationFilter {

	 /**
     * 判断用户是否想要登入。
     * 检测header里面是否包含authc字段即可
     */
    @Override
    protected boolean isLoginAttempt(ServletRequest request, ServletResponse response) {
        HttpServletRequest req = (HttpServletRequest) request;
        String authorization = req.getHeader("authc");
        return authorization != null;
    }

    /**
     * 如果携带token进行登录
     */
    @Override
    protected boolean executeLogin(ServletRequest request, ServletResponse response){
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String authorization = httpServletRequest.getHeader("authc");

        JWTToken token = new JWTToken(authorization);
        // 提交给realm进行登入，如果错误他会抛出异常并被捕获
        getSubject(request, response).login(token);
        // 如果没有抛出异常则代表登入成功，返回true
        return true;
    }
    
    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
    	HttpServletResponse resp = (HttpServletResponse)response;
    	Boolean flag = true;
    	//判断用户是否携带了token
        if (isLoginAttempt(request, response)) {
            try {
				executeLogin(request, response);
			} catch (Exception e) {
				flag = false;
			}
            if(!flag) {
            	try {
					resp.sendRedirect("/login");
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
            }
            return flag;
        }else {
        	//未携带token,重定向至登录页面
			try {
				resp.sendRedirect("/login");
			} catch (IOException e1) {
			}
        	return false;
        }
        
    }
}

```

我们看到有几行代码中有：

```java
resp.sendRedirect("/login");
```

到底是配置文件在其作用，还是该重定向代码呢？

我们先打断点看看：

![image-20220409203824428](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220409203824428.png)

首先，确实是执行到了具体重定向语句，我们尝试修改该语句，再来测试一下：

将`/login`修改为`/noLogin`,其接口内容如下：

```java
public void noLogin() {
		renderText("未登录测试！");
	}
```



重新测试：

首先，我们发现，该过滤器会一直自我循环中，猜测是因为配置文件中配置的`/**=app_authc`导致重定向`/noLogin`也会走该过滤器的问题，所以我们在ini中配置：

```ini
/noLogin = anon
```

再次测试：

![image-20220409204818770](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220409204818770.png)

由此可见，配置与代码不一时，代码是要优先于配置设置的。

