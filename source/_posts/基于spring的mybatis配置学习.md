---
title: 基于spring的mybatis配置学习
comments: true
date: 2021-11-05 17:58:19
categories:
tags:
---

这是我参与11月更文挑战的第6天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)



要学mybatis，[官方文档](https://mybatis.org/mybatis-3/zh/index.html)写的是个什么玩意哦，看不懂，还是动手试试吧

## 创建基础项目



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78ed1fe408f544ab9def4c57586568c5~tplv-k3u1fbpfcp-watermark.image?)

记得勾上mybatis，JDBC API，MySql什么的，如果这里不打钩，之后还要去手动修改maven的pom.xml文件。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b1425b3cb34acb98bbfa711508a1c6~tplv-k3u1fbpfcp-watermark.image?)

然后创建项目。从网上找一个基础的mysql配置，如下图所示，修改成自己的链接。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd33d9feb3424a7682c1602c5acf8caa~tplv-k3u1fbpfcp-watermark.image?)

需要注意几点：

1. `driver-class-name`设置为`com.mysql.jdbc.Driver`时，console中会弹出错误提示：

   ```
   Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
   ```

2. 默认生成的pom.xml中，`tomcat`的`scope`值为`provided`，导致项目一启动就关闭了，我们需要把这一行注释掉：

   ```xml
   		<dependency>
   			<groupId>org.springframework.boot</groupId>
   			<artifactId>spring-boot-starter-tomcat</artifactId>
   			<!--<scope>provided</scope>-->
   		</dependency>
   ```

然后，我们按照服务层次，依次创建项目文件夹：controller，service以及mybatis相关的entity, mapper。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f3e6f16a85d40159f66138f97d33306~tplv-k3u1fbpfcp-watermark.image?)

## 配置MyBatis

在文件`application.yml`中，我们简单的配置mybatis的mapper路径与实体包路径。

```yaml
# MyBatis配置
mybatis:
  # 搜索指定包别名
  typeAliasesPackage: com.example.demo.mybatis.entity
  # 配置mapper的扫描，找到所有的mapper.xml映射文件
  mapperLocations: classpath*:mybatis/mapper/*Mapper.xml #xml是存放在resources目录下的
```

## 试运行

一切配置好之后，尝试运行，嗯，报错。提示找不到对应的bean：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dec5d3776fda4b3b8df33352493a097a~tplv-k3u1fbpfcp-watermark.image?)

经过检索发现，**springboot要求将扫描目录放置在主程序入口的同一个包或子包中**。

所以我们通过IDE调整目录。目录我们稍后截图看效果。

## 数据库建表

我们建立一个简单的表看一下，名叫`s_user`, 表结构如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e52997cb962141668da3dc0e717253fd~tplv-k3u1fbpfcp-watermark.image?)

在IDE中建立他的entity，以及xml文件存放sql。

经过输入，最终，我们的程序目录如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/863f02062d2d4e7ca4eb42d13ceeec6e~tplv-k3u1fbpfcp-watermark.image?)

在接口中，我们简单实现代码为：

```java
@Controller
public class UserController {

    @Autowired
    private UserService userServiceImpl;

    @RequestMapping("/")
    @ResponseBody
    public String GetUser(){
        return userServiceImpl.findById(1).toString();
    }
}
```

其中对应的sql是

```sql
select * from s_user where id = #{id}
```

最终页面效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bee656b2b474a56a802c23068aaa0ce~tplv-k3u1fbpfcp-watermark.image?)

这个跟springboot配置有关，本着文章为介绍mybatis，具体如何文字输出我们不再阐述。









