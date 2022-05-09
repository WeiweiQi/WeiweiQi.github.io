---
title: 拥抱云原生——Quarkus基本使用
comments: true
date: 2021-06-14 10:56:02
categories: 后端
tags: 后端
---

这是我参与更文挑战的第14天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 心似白云常自在，意如流水任东西。

在[拥抱云原生——初探Quarkus](https://juejin.cn/post/6972520666641743908)中，简单的了解了一下Quarkus。本文继续学习云原生以及Quarkus。

## 云原生

云原生，Cloud Native，最早于2015年的[“迁移到云原生应用架构”](https://learning.oreilly.com/library/view/migrating-to-cloud-native/9781492047605/)中提出，其中总结了云原生应用的5个关键特征：

1. [十二要素应用程序](https://12factor.net/)
2. 微服务
3. 敏捷的自助式基础设施
4. 基于API进行服务间协作
5. 反脆弱

谷歌2018年所发布的云原生定义为：

> 云原生技术使组织能够在现代化和动态的环境（例如公共云、私有云和混合云）中，构建和运行可进行容量伸缩的应用程序。其代表技术包括容器、服务网格、微服务、不可变基础设施和声明性API。
>
> 1. 应用容器化
> 2. 面向微服务架构
> 3. 应用支持容器的编排调度
>
> 这些技术能够构建富有韧性、便于管理和易于观测的松耦合系统。结合强大的自动化功能，这些技术能使工程师们可以轻松、频繁且可预测地对系统做出重大变更。

后续，2020年VMware定义云原生为：

>  “云原生是一种利用云计算软件交付模型的优势，来构建和运行应用程序的方法。当公司使用云原生架构构建和运行应用程序时，他们能更快地将新想法推向市场，并更快地响应客户需求。....云原生应用更关注如何创建和部署应用程序。云原生更重要的方面，是能够为开发人员提供能按需访问的计算能力，以及现代化的数据和应用程序服务的能力。云原生开发要与DevOps、持续交付、微服务和容器的概念相结合。”

目前Redhat关于云原生应用的定义与理解：

> 云原生应用开发是根据众所周知的云计算技巧与技术构建、运行和改进应用的一种方法。
>
> 云原生应用是独立的小规模松散耦合服务的集合，旨在提供备受认可的[业务价值](https://www.redhat.com/zh/resources/451-research-agile-integration-cloud-native-architectures)，例如快速融合用户反馈以实现持续改进。简而言之，通过云原生应用开发，您可以加速构建新应用，优化现有应用并[在云原生架构中集成](https://www.redhat.com/zh/topics/integration)。其目标是以企业需要的速度满足应用用户的需求。

云原生是一种行为方式和设计理念，究其本质，凡是能够提高云上资源利用率和应用交付效率的行为或方式都是云原生的[3]。

云原生是一种**构建和运行应用程序的方法**，是一套技术体系和方法论。云原生（CloudNative）是一个组合词，Cloud+Native。Cloud表示应用程序位于云中，而不是传统的数据中心；Native表示应用程序从设计之初即考虑到云的环境，原生为云而设计，**在云上以最佳姿势运行**，充分利用和发挥云平台的弹性+分布式优势。**总而言之，符合云原生架构的应用程序应该是：采用开源堆栈（K8S+Docker）进行容器化，基于微服务架构提高灵活性和可维护性，借助敏捷方法、DevOps支持持续迭代和运维自动化，利用云平台设施实现弹性伸缩、动态调度、优化资源利用率。**[4]。

![](https://user-gold-cdn.xitu.io/2020/6/23/172df2b96424af31?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

>  图片来源：
> 作者：华为云开发者社区
> 链接：https://juejin.cn/post/6844904197859590151
> 来源：掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## Quarkus基本使用

说完理论，我们再来点Quarkus实践。教程来源于：https://quarkus.io/guides/getting-started

### 注入

在Quarkus中，使用`@Inject`可以注入。更多信息： [Contexts and Dependency Injection guide](https://quarkus.io/guides/cdi-reference)

```java
package org.acme.getting.started;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.resteasy.annotations.jaxrs.PathParam;

@Path("/hello")
public class GreetingResource {
	
    // 注入
	@Inject
	GreetingService service;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }
    
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/greeting/{name}")
    public String greeting(@PathParam String name) {
        return service.greeting(name);
    }
}
```

### 开发模式

运行项目的方式是执行命令：

```shell
./mvnw compile quarkus:dev
```

其中`quarkus:dev`表示我们以开发模式运行。开发模式下将启动热更新机制。

### 测试

可以使用`@QuarkusTest`注解测试类，`@Test`注解方法。然后命令行执行：`./mvnw test`

```java
@QuarkusTest
public class GreetingResourceTest {

    @Test    
    public void testHelloEndpoint() {
        ....
    }

    @Test
    public void testGreetingEndpoint() {
       .....
    }

}
```

### 打包

执行命令：

```shell
./mvnw package
```

会生成

1. `getting-started-1.0.0-SNAPSHOT.jar`- 仅包含项目的类和资源，它是 Maven 构建生成的常规工件 - 它**不是**可运行的 jar；
2. `quarkus-app`文件夹，包括一个可执行的 `quarkus-run.jar` 文件。这个jar不是引用jar，不需要把它放到`quarkus-app/lib/` 
3. 如果想部署到容器中，应该部署整个`quarkus-app`目录。
4. 如果单纯执行，可以运行命令`java -jar target/quarkus-app/quarkus-run.jar`
5. 如果在配置文件中配置打包模式为`fast-jar`，则生成的包启动更快，占用内存更小。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12e0b7670f9947ca9ac965848afb2886~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65a37137e1ed421d9dd3d28072bf9a3b~tplv-k3u1fbpfcp-watermark.image)



[1] [什么是云原生](https://www.jianshu.com/p/a37baa7c3eff)

[2] [迁移到云原生应用架构](https://jimmysong.io/migrating-to-cloud-native-application-architectures/)

[3] [云原生（Cloud Native）的定义——教程](https://jimmysong.io/kubernetes-handbook/cloud-native/cloud-native-definition.html)

[4] [什么是云原生？这回终于有人讲明白了——华为](https://juejin.cn/post/6844904197859590151)

[5] [如何理解云原生(Cloud Native) 应用 ？——Red Hat](https://www.redhat.com/zh/topics/cloud-native-apps)

[6] [云原生架构概述](http://dockone.io/article/2991) 其中对比了SpringCloud与Kubernetes

