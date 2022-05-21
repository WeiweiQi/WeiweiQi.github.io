---
title: 讨论两种Redis-Token存储方式
comments: true
date: 2022-05-12 17:51:02
categories:
tags:
---
本文讨论一个问题：

存储token时，token与对应用户id谁来作为key？

## 问题起源

问题起源于要给公司的后台管理系统添加权限管理，选用的是开源框架shiro，而原本系统上是采用token做了登录校验的。

我所采用的shiro验证方式是，每次接口请求，根据token来获取用户id，然后通过shiro中的登录验证机制来进行权限校验。

因此，“根据token获取用户id”就要求在存储用户token时，以token为键值key，以用户ID为value值。

然而此时面临一个问题是，系统原本的token存储方式如下，我们称之为第一种:用户ID为key。

```java
cache.set(TOKEN_PREFIX + userid, token);
```

这就需要我做出判断，需不需要修改token的存储方式为下面的形式：我们称之为第二种：token为key。

```java
cache.set(TOKEN_PREFIX + token, userid);
```

## 思考

### 第一个问题，两种方式是否都能够实现需求功能？

我们需要实现的功能包括：

1. 登录验证
2. shiro中的权限验证

#### 登录验证

对于"用户ID为key"的方式，需要前端传递用户id+token两个值，验证登录状态需要我们根据前端传递的用户ID，获取数据库中存储的token，与前端传递的token进行校验，如果一致，则校验通过，否则返回错误信息，提示用户需要重新登录等等。

对于“token为key”的方式，前端至少需要传递token一个值，根据前端传递的token，获取数据库中存储的用户ID，如果能获取到，则校验通过，否则提示用户token已过期，需要用户重新登录等等。

#### shiro中的权限验证

shiro中的权限验证，涉及到具体的实现机制，以token为key的方式，就以我们的真实实现为例：

```java

// shiro登录代码：
Subject s = SecurityUtils.getSubject();
JWTToken jwtToken = new JWTToken(token);
subject.login(jwtToken);


// 实现AuthenticationToken的类：
import org.apache.shiro.authc.AuthenticationToken;

public class JWTToken implements AuthenticationToken {
	private static final long serialVersionUID = 1L;

	// 密钥
    private String token;

    public JWTToken(String token) {
        this.token = token;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return token;
    }
}

/**
* 自定义的登录验证类：
*/
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
		SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
		//这里可以连接数据库根据用户账户进行查询用户角色权限等信息
		return simpleAuthorizationInfo;
	}

	/**
	 * 自定义认证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken auth) throws AuthenticationException {
		String token = (String) auth.getCredentials();
		 // 解密获得userid，用于和数据库进行对比
         // getUserId实际就是通过token，在数据库中取对应的userid
        Integer userid = JwtUtils.getUserId(token);
        if (tuserid == null) {
            throw new AuthenticationException("token 校验失败");
        }
		return new SimpleAuthenticationInfo(token, token, getName());
	}
}


```

如果采用userid为key的方式，不难实现，也修改其实现方式，

### 第二个问题，两种方式哪一种传输的数据量更少？

第一种方式需要前端每次请求都传递token+userid；而第二种实际上可以只传递token，后台根据token解密（或数据库查找）来获取用户信息。

### 第三个问题，两种方式哪种更安全？

两种方式的安全应该是一样的，核心是后台通过数据库保存token与userid的对应信息。

## 个人意见

个人比较细化第二种，以token为key的方式，首先，前端传递简单，只需要传递token即可；二是后端通过这种方式，可以统一当前登录人的获取方式，而不是每次在接口中获取header中的用户id。
