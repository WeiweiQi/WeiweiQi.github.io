---
title: 如何在springboot内使用junit做接口测试
comments: true
date: 2022-03-15 11:00:53
categories:
tags:
---



> 夫宠而不骄，骄而能降，降而不憾，憾而能眕者，鲜矣。——————《古文观止 · 石碏谏宠州吁 》《左传 · 隐公三年》

## 起因

最开始接触springboot是因为公司开始接触微服务架构，而使用最普遍的项目是SpringCloud，SpringCloud中的每个微服务都是基于springboot来开发的，也因此接触到springboot。

不过后来因为种种原因，微服务技术路线没有完全执行起来，springboot的接触也仅仅停留在表面。

最近，因为学习vue前端，接触到element-ui，又接触到一个前后台整体框架若依系统ruoyi，其使用的框架也是springboot，因此也重新燃起学习springboot的热情。

今天我们来看看springboot中如何做单元测试。

## Junit各个版本区别

我们知道Java有一个非常遍历的单元测试中间件junit，目前版本已经到了junit5了，springboot目前最新版中使用的是Junit Jupiter。

> junit4, junit5 jupiter之间的关系：
>
> Junit 5 包括 Junit Platform， Junit Jupiter， Junit Vintage三部分。
>
> Junit Platform是在JVM上启动测试框架的基础，不仅支持Junit自制的测试引擎，也可以接入其他测试引擎。
>
> Junit Jupiter提供了JUnit5的新的编程模型，是JUnit5新特性的核心。内部包含了一个测试引擎，用于在Junit Platform上运行。
>
> Junit Vintage是为了照顾老的项目，JUnit Vintage提供了兼容JUnit4.x, Junit3.x的测试引擎。

Junit4以及Junit5的区别如下图所示。注：该图[原文地址](https://www.jb51.net/article/216198.htm)

![image-20220315150459244](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220315150459244.png)

## springboot中一个基础的接口测试样例

首先我们创建springboot以及一个基础的接口。如下所示：

```java
@RestController
public class TestController {

    @Autowired
    MyService myService;
    
    @GetMapping("test")
    public String sayHello() {
        return myService.show();
    }
}


@Component
public class MyService {
    public String show() {
        return "我在MyService中";
    }
}
```

我们在测试类中编写如下代码：

```java
@ExtendWith(SpringExtension.class)
@WebMvcTest(TestController.class)
class TestControllerTest {

    @MockBean
    MyService myService;

    @Autowired
    MockMvc mockMvc;

    @Test
    public void sayHello() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/test").accept(MediaType.ALL_VALUE))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
    }

}
```

需要注意的是，在测试类中，同样需要使用`@Atuowired`引入相关的服务对象，以及mock模拟对象。