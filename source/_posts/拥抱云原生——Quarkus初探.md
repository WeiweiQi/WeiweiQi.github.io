---
title: 拥抱云原生——Quarkus初探
comments: true
date: 2021-06-11 14:36:44
categories: 后端
tags: 后端
---





这是我参与更文挑战的第11天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 星星之火，可以燎原。

在掘金看到有推活动：“[掘金线下沙龙——拥抱云原生：探索云原生下的框架与存储](https://sourl.co/BRkxEQ)”，看到其中有位大佬的主题是“Java拥抱云原生——Quarkus介绍”，工作三年开发的表示一脸懵逼，云原生？Quarkus？没听过~~学！！

## Quarkus介绍

Quarkus据说是RedHat开源的一个微服务框架，所以可以把它与SpringCloud/SpringBoot类比？

暂且不表，先看官方文档！比较不能成为尤大嘴里的“有些人”~此处应该有个表情包！

[Quarkus官网](https://quarkus.io/)

[什么是Quarkus？](https://www.redhat.com/zh/topics/cloud-native-apps/what-is-quarkus)

Quarkus是专为OpenJDK Hotspot 和 GraalVM而生的一个全栈，Kubernetes-native的Java应用框架，相比Spring，**低内存消耗，快速启动**，允许将命令式代码和非阻塞响应式风格结合起来。

在[什么是Quarkus](https://www.redhat.com/zh/topics/cloud-native-apps/what-is-quarkus)中说：Quarkus 构建的应用其**内存消耗只有传统 Java 的 1/10，而且启动时间更快（快了 300 倍）**。

### Quarkus关键字

1. 为开发人员设计：实时编码，统一配置，原生可执行文件生成。

2. 容器优先：支持GraalVM/SubstrateVM，构建时元数据处理，减少反射使用，本机映像预启动。
3. 命令式和响应式代码

> Talk is Cheap，Show me the Code！



## Quarkus实战

开启Quarkus的Hello World之旅~

[官方教程](https://quarkus.io/guides/getting-started)

环境需求：

1. IDE: eclipse、idea、vscode，vim，emacs等，我们使用的环境是Eclipse
2. Java JDK 8 or 11+，笔者电脑安装的Jdk 8
3. Apache Maven 3.6.2+ 或 Gradle，笔者电脑安装的是maven 3.6.0~，先不升级试试~



首先尝试直接`git clone`官方的github-demo

```shell
git clone https://github.com/quarkusio/quarkus-quickstarts.git
# 上述链接下载不了可以尝试以下链接：
# git clone git@github.com:quarkusio/quarkus-quickstarts.git  
```

发现项目下载内容超多

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5ac301a8a87426da30ba53d584b0630~tplv-k3u1fbpfcp-watermark.image)

暂不用官方给的样例，我们仿照 [Bootstrapping the project](https://quarkus.io/guides/getting-started#bootstrapping-the-project) 的流程执行：

powershell中执行命令：

```shell
mvn io.quarkus:quarkus-maven-plugin:1.13.7.Final:create -DprojectGroupId=org.acme -DprojectArtifactId=getting-started -DclassName="org.acme.getting.started.GreetingResource" -Dpath="/hello"
```

输出结果：

```shell
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:00 min
[INFO] Finished at: 2021-06-11T18:00:18+08:00
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal io.quarkus:quarkus-maven-plugin:1.13.7.Final:create (default-cli) on project standalone-pom: Detected Maven Version (3.6.0)  is not supported, it must be in [3.6.2,). -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException
```

报了几个错误，怀疑是我们的maven版本问题，所以我们升级maven后重新运行以上命令。

升级maven 3.8.0后，执行命令，输出结果为：

```bash
applying codestarts...
>> java
>> maven
>> quarkus
>> config-properties
>> dockerfiles
>> maven-wrapper
>> resteasy-example

-----------
[SUCCESS] quarkus project has been successfully generated in:
--> D:\XXXXX\learn\Quarkus\getting-started
-----------
[INFO]
[INFO] ========================================================================================
[INFO] Your new application has been created in D:\XXXXX\learn\Quarkus\getting-started
[INFO] Navigate into this directory and launch your application with mvn quarkus:dev
[INFO] Your application will be accessible on http://localhost:8080
[INFO] ========================================================================================
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:36 min
[INFO] Finished at: 2021-06-11T20:31:23+08:00
[INFO] ------------------------------------------------------------------------
```

可以看到，有一个“greeting-started”的maven项目，我们将其导入到eclipse中，其项目目录如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2042729c04d4758929eab007df37b2d~tplv-k3u1fbpfcp-watermark.image)



我们尝试运行一下项目：

```shell
cd .\getting-started\
./mvnw compile quarkus:dev
```

powershell中输出结果：

```shell
[INFO] Scanning for projects...
Downloading from central: https://repo.maven.apache.org/maven2/io/quarkus/quarkus-universe-bom/1.13.7.Final/quarkus-universe-bom-1.13.7.Final.pom
Downloaded from central: https://repo.maven.apache.org/maven2/io/quarkus/quarkus-universe-bom/1.13.7.Final/quarkus-universe-bom-1.13.7.Final.pom (614 kB at 256 kB/s)
[INFO]
[INFO] ----------------------< org.acme:getting-started >----------------------
[INFO] Building getting-started 1.0.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
Downloading from central: https://repo.maven.apache.org/maven2/io/quarkus/quarkus-arc/1.13.7.Final/quarkus-arc-1.13.7.Final.pom
.......省略
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ getting-started ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 2 resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) @ getting-started ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to D:\QiWeiwei\learn\Quarkus\getting-started\target\classes
[INFO]
[INFO] --- quarkus-maven-plugin:1.13.7.Final:dev (default-cli) @ getting-started ---
Listening for transport dt_socket at address: 5005
2021-06-11 20:50:51,951 WARN  [io.qua.dep.QuarkusAugmentor] (main) Using Java versions older than 11 to build Quarkus applications is deprecated and will be disallowed in a future release!
__  ____  __  _____   ___  __ ____  ______
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/
2021-06-11 20:50:54,529 INFO  [io.quarkus] (Quarkus Main Thread) getting-started 1.0.0-SNAPSHOT on JVM (powered by Quarkus 1.13.7.Final) started in 2.757s. Listening on: http://localhost:8080
2021-06-11 20:50:54,530 INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
2021-06-11 20:50:54,531 INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [cdi, resteasy]
```

浏览器中请求：`http://localhost:8080/hello`结果如下

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10860e671e8b47cab589300c1af20468~tplv-k3u1fbpfcp-watermark.image)





