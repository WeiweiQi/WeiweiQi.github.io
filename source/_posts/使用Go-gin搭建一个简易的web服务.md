---
title: 使用Go-gin搭建一个简易的web服务
comments: true
date: 2021-06-03 19:56:23
categories: 后端
tags: Go
---



这是我参与更文挑战的第4天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)



工作环境主要是Java，听说Go挺快的。前些天参加掘金Go主题月学习了一些基本语法，刷了些题，现在尝试着使用Go的web框架做一些基本服务。

并不一定选用Go，主要是因为有别的同事用Gin写过小服务，因此，如果Gin不错，或许可以在同事间推广一下，毕竟，Go与C很像，学习蛮简单的。

#### Gin的相关资料

源码地址：https://github.com/gin-gonic/gin， https://gitee.com/github-image/gin-gonic-gin （国内可用）

官网文档地址：https://gin-gonic.com/zh-cn/docs/，支持中文

Gin关键词：Web框架，httprouter， 快速，支持中间件，Crash处理，JSON验证，路由组，错误处理，内置渲染，可扩展行。



#### 上手

Gin要求Go 1.13及以上，检查Go的版本：

```shell
go version
// output: go version go1.16.2 windows/amd64
```

##### 不支持Go-mod的方法

**更推荐大家使用Go-mod方法。**

安装引入Gin，net/http包

```shell
 go get -u github.com/gin-gonic/gin
 // go: downloading xxxx.......
```

创建.go代码文件，并按照官方教程拷贝一个模板文件：

```shell
curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
// curl: The term 'curl' is not recognized as a name of a cmdlet, function, script file, or executable program.
// Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

windows powershell不支持`curl`命令，我们手动拷贝，main.go代码如下：

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var db = make(map[string]string)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}

```

然后按照代码错误提示，手动将对应目录的软件包拷贝至`$GOPATH/src`目录下。重申：更推荐大家使用Go-mod方法。

##### 支持Go-mod的方法

`cd`到工作目录下之后：

```shell
cd D:\lean_space\gin
// 拷贝文件
go mod init mygin.web
go mod tidy
```

开始运行：

```shell
go run main.go
```

打开postman获取浏览器，输入网址：http://localhost:8080/，显示如下：

```
404 page not found
```

我们看到代码中有如下代码，猜测路由监听路径有`/ping`，正如我们所料，获取了字符串pong。

```go
r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
```

我们分别按照如下方式发起请求：

1. GET http://localhost:8080/ping 返回 pond

2. POST http://localhost:8080/admin  header中配置
   {	authorization： " Basic Zm9vOmJhcg==", content-type: "application/json" }
   Postman-body-raw配置： {"value":"bar"}

   ```json
   {
       "status": "ok"
   }
   ```

3. GET http://localhost:8080/user/foo

   ```json
   {
       "user": "foo",
       "value": "bar"
   }
   ```

测试成功！

控制台输出如下：

```shell
PS D:\lean_space\gin> go run main.go
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /ping                     --> main.setupRouter.func1 (3 handlers)
[GIN-debug] GET    /user/:name               --> main.setupRouter.func2 (3 handlers)
[GIN-debug] POST   /admin                    --> main.setupRouter.func3 (4 handlers)
[GIN-debug] Listening and serving HTTP on :8080
[GIN] 2021/06/03 - 21:35:31 |?[97;42m 200 ?[0m|            0s |             ::1 |?[97;46m POST    ?[0m "/admin"
[GIN] 2021/06/03 - 21:35:35 |?[97;42m 200 ?[0m|            0s |             ::1 |?[97;44m GET     ?[0m "/ping"
[GIN] 2021/06/03 - 21:35:39 |?[97;42m 200 ?[0m|            0s |             ::1 |?[97;44m GET     ?[0m "/user/foo"

```



我们仿照其他接口，写一个我们自己的接口，接口路径为：/hellogin，代码如下：

```go
r.GET("/hellogin", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"result": "hello, go-gin! hello go Web!"})
	})
```

测试结果如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb5b58e5a3344a38b3a20f116c700feb~tplv-k3u1fbpfcp-watermark.image)



显然，`r.GET("/xxx")`表示该方法可以服务于访问路径`/xxx`的HTTP-GET请求。

`c.JSON`表示返回的数据格式是JSON。查阅资料发现，gin支持[XML/JSON/YAML/ProtoBuf 渲染](https://gin-gonic.com/zh-cn/docs/examples/rendering/)，也支持JSONP，PureJSON, SecureJson等。

在https://gin-gonic.com/zh-cn/docs/examples/中可以找到现成的gin-web实例以解决实际生产问题。



习惯了Java那种巨型架构之后，使用Gin的体验就是，**这就真的可以了吗？这样跑到生产环境没问题吧~~~**

