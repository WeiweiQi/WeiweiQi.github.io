---
title: 使用arthas trace命令查看代码各方法响应时间
comments: true
date: 2021-06-17 17:13:04
categories: 后端
tags: 后端
---

这是我参与更文挑战的第18天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

## 事情起源

因为生产环境与开发环境总有些差异，最普遍的是数据量不同。这导致在测试环境下发现不了的某些卡顿问题会发生在生产环境中，尤其小团队中基本是没有测试岗位的，大多生产环境的卡顿问题是上线以后才会暴露出来。

问题来了：

1. 如何在线上系统运行的情况下定位问题代码？
2. 如何避免修改原代码来定位问题代码？

最基本的定位方法是：定位到卡顿的接口，通过在各个方法**请求前与请求后打印时间戳**来计算各方法的响应时间。

这个基本方法有什么问题呢？

1. 如果开发人员无权获取生产环境怎么重现。
2. 如果调用方法很多的情况下，通过响应时间戳定位效率太低。

## Arthas工具

[Arthas官网](https://arthas.aliyun.com/doc/index.html)

Arthas是阿里巴巴开源的一款Java诊断工具。Arthas除了解决我们上述定位接口卡顿问题，还能解决一下问题[1]：

> 1. 这个类从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
> 2. 我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
> 3. 遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
> 4. 线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
> 5. 是否有一个全局视角来查看系统的运行状况？
> 6. 有什么办法可以监控到JVM的实时运行状态？
> 7. 怎么快速定位应用的热点，生成火焰图？
> 8. 怎样直接从JVM内查找某个类的实例？

几个常用的命令：

`watch`：方法执行数据观测

`monitor`：方法执行监控

`trace`：方法内部调用路径，并输出方法路径上的每个节点上耗时

`stack：`输出当前方法被调用的调用路径

`tt`：方法执行数据的时空隧道，记录下指定方法每次调用的入参和返回信息，并能对这些不同的时间下调用进行观测

arthas还可以生成火焰图，我们本文不做详述。

## 启动arthas

下载arthas后，命令打开对应文件夹，使用以下命令，即可启动arthas：

```shell
java -jar arthas-boot.jar
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9c0da6e8fb349c4a2db5b3fdd1a5ae3~tplv-k3u1fbpfcp-watermark.image)

## trace命令

这一节来看看怎么用`trace`命令获取各个方法`method`的执行时间。

[trace在线文档](https://arthas.aliyun.com/doc/trace.html)

trace最基本的使用方法是监听方法调用路径和各个方法的耗时：

```shell
trace class-pattern method-pattern
```

如图所示，我们监听类`com.xxxx.productmanage.ProductManageController`的`index()`方法/接口：

```shell
trace com.xxxx.productmanage.ProductManageController index
```

效果如图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4935a679f47477490150834aaf0eec1~tplv-k3u1fbpfcp-watermark.image)

我们请求`index()`方法对应的接口：浏览器刷新指定页面。

查看命令行输出：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa46e6a7b23d4e25a25290ebbe2a472f~tplv-k3u1fbpfcp-watermark.image)

可以清晰的看到各个方法的执行时间（貌似是命令行语言设置问题导致有些符号异常），如此，我们便可以轻松的定位到方法的执行时间。

### 深入

可以看到上述命令只能看到当前类中各个方法的执行时间，如果要深入调用的其他类对应方法又该怎么办呢？

比如我们要进一步监听上述耗时较长的`getCompanys`方法内部调用。

#### 方法1

```shell
 trace - E class1|class2 method1|method2
```

如上述定位问题，我们执行：

```shell
trace -E com.xxxxx.ProductManageController|com.xxxx.ProductManageService index|getCompanys
```

输出结果为：

```shell
Press Q or Ctrl+C to abort.
Affect(class count: 2 , method count: 2) cost in 147 ms, listenerId: 6
```

然后再次请求接口，输出结果如下图：

```shell
[arthas@18804]$ trace -E com.highmall.suppliermanage.productmanage.ProductManageController|com.highmall.suppliermanage.productmanage.ProductManageService index|getCompanys
Press Q or Ctrl+C to abort.
Affect(class count: 2 , method count: 2) cost in 147 ms, listenerId: 6
`---ts=2021-06-17 18:24:01;thread_name=XNIO-1 task-3;id=55;is_daemon=false;priority=5;TCCL=com.jfinal.server.undertow.hotswap.HotSwapClassLoader@6156496
    `---[73.303623ms] com.highmall.suppliermanage.productmanage.ProductManageController:index()
        +---[0.080517ms] com.xxxx.productmanage.ProductManageController:getHeader() #46
        +---[0.223587ms] com.xxxx.productmanage.ProductManageController:getParaToInt() #47
        +---[0.034004ms] com.xxxx.productmanage.ProductManageController:getParaToInt() #48
        +---[0.029192ms] com.xxxx.productmanage.ProductManageController:getPara() #49
        +---[0.030154ms] com.xxxx.productmanage.ProductManageController:getParaToInt() #50
        +---[71.959859ms] com.xxxx.ProductManageService:getCompanys() #51
        |   `---[71.861378ms] com.xxxx.productmanage.ProductManageService:getCompanys()
        |       +---[38.061978ms] com.xxxx.productmanage.ProductManageService:haveManageAllCompanyRight() #157
        |       +---[0.083083ms] com.jfinal.kit.StrKit:notBlank() #162
        |       `---[32.933605ms] com.jfinal.plugin.activerecord.Db:paginate() #172
        `---[0.446852ms] com.xxxx.productmanage.ProductManageController:renderAppJson() #52
```

截图如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c900f24c86c64f23af1ec4f4ebe8a688~tplv-k3u1fbpfcp-watermark.image)

#### 方法2

这种方法我**并没有重现**，不知是操作问题还是arthas版本问题，但是原操作文档有这一部分，我们暂且保留。

需要我们打开另外一个命令行窗口，执行命令:

```shell
telnet localhost 3658
```

链接到我们正在执行的Arthas，然后执行以下命令，添加监听：

```
trace com.xxxxxx.productmanage.ProductManageService getCompanys --listenerId 1
```

然后保持我们原有的命令窗口，重新调用接口，查看效果：

第一个终端还是只输出了一层，IT **NOT WORK** FOR ME!!!





[1] [Arthas（阿尔萨斯） 能为你做什么](https://arthas.aliyun.com/doc/index.html)

