---
title: 若依中的代码生成器-Domain代码生成篇2
comments: true
date: 2021-11-10 18:56:05
categories:
tags:
---

这是我参与11月更文挑战的第10天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)

继《[若依中的代码生成器-Domain代码生成篇1](https://juejin.cn/post/7028888697474908167)》，我们继续来学习若依管理系统中的代码生成器。

上次说到通过mybatis-collection机制，将数据库中的一对多数据映射为Java对象`GenTable`，之后又是如何一步一步的生成预览代码的呢？

我们注意到`GenTable`中有一个字段名为`tplCategory`，它可取值`crud`， `tree`，`sub`，分别表示

crud：单表；`tree`：树表操作；`sub`：主子表。暂未涉及，按下不表[手动狗头]。

## 模板引擎 Velocity

后续代码执行到：

```java
VelocityInitializer.initVelocity();
```

这一句执行中，引入了一个第三方的类库`org.apache.velocity.app.Velocity`。经过询问度娘与谷哥，我们知道这是一个模板引擎。

通过简单阅读`Velocity`文档，了解到它可以通过配置模板并配合java代码实现后续内容填充。比如在掘金网站上有一篇博客介绍了如何使用Velocity：[Velocity开发指南](https://juejin.cn/post/6844904177949212686)，例如，模板文件`hello.vm`中内容为:

```
Hi! This $name from the $project project.
```

通过对`name`与`project`赋值，我们可以生成想要的内容。

```java
		/* 首先，初始化运行时引擎，使用默认的配置 */
        Velocity.init();
        /* 创建Context对象，然后把数据放进去 */
        VelocityContext context = new VelocityContext();
        context.put("name", "Velocity");
        context.put("project", "Jakarta");
        /* 渲染模板 */
        StringWriter w = new StringWriter();
        Velocity.mergeTemplate("testtemplate.vm", context, w );
        System.out.println(" template : " + w );
// 代码来源：
// 作者：小小小海文
// 链接：https://juejin.cn/post/6844904177949212686
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

然后，自然而然的下一步就是构造Velocity的数据以及获取模板。构造数据代码如下所示：

```java
/**
     * 设置模板变量信息
     *
     * @return 模板列表
     */
    public static VelocityContext prepareContext(GenTable genTable)
    {
        // 省略代码......
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("tplCategory", genTable.getTplCategory());
        velocityContext.put("tableName", genTable.getTableName());
        velocityContext.put("functionName", StringUtils.isNotEmpty(functionName) ? functionName : "【请填写功能名称】");
        velocityContext.put("ClassName", genTable.getClassName());
	    // 省略代码......
        return velocityContext;
    }
```

寻找模板代码如下：

```java
 List<String> templates = new ArrayList<String>();
 templates.add("vm/java/domain.java.vm");
 templates.add("vm/java/mapper.java.vm");
 templates.add("vm/java/service.java.vm");
 templates.add("vm/java/serviceImpl.java.vm");
 templates.add("vm/java/controller.java.vm");
 templates.add("vm/xml/mapper.xml.vm");
 templates.add("vm/sql/sql.vm");
 templates.add("vm/js/api.js.vm");
 if (GenConstants.TPL_CRUD.equals(tplCategory))
 {
     templates.add("vm/vue/index.vue.vm");
 }
else if (GenConstants.TPL_TREE.equals(tplCategory))
{
    templates.add("vm/vue/index-tree.vue.vm");
}
else if (GenConstants.TPL_SUB.equals(tplCategory))
{
    templates.add("vm/vue/index.vue.vm");
    templates.add("vm/java/sub-domain.java.vm");
}
```

其中特意根据表类型做了区分，我们来看看其中的`domain.java.vm`长什么样子？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9559b6c1e6d4b31a790af988776b3b7~tplv-k3u1fbpfcp-watermark.image?)

有点复杂的样子。

