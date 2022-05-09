---
title: 若依中的代码生成器-Domain代码生成篇1
comments: true
date: 2021-11-10 16:14:36
categories:
tags:
---

这是我参与11月更文挑战的第9天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)

前两天，通过文章: 《[若依中的代码自动生成器研究-表查询篇](https://juejin.cn/post/7028143244668059662)》以及《[若依中的代码生成器-数据库篇](https://juejin.cn/post/7028509728133087262)》对若依代码生成器的前一段代码的阅读，我们了解了若依代码生成器的一些逻辑，包括通过数据库的`information_schema. TABLES`查询表信息，以及`information_schema. COLUMNS`查询指定表的列信息，将其转换到表`gen_table`与`gen_table_column`中的数据行，以便后续查询与代码转换。

今天我们继续来看若依系统中是如何自动生成domain代码的。

我们在系统菜单“**系统工具**”->"代码生成"中以及可以看到我们导入的表`my_user`，如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c55f6a9bd5374504be7938b6655e6634~tplv-k3u1fbpfcp-watermark.image?)

这一行右侧有5个按钮，分别是预览、编辑、删除、同步、生成代码。

## 预览

我们点击“**预览**”，在弹出窗口中可以看到可以预览生成的代码包括：domain.java， mapper.java， service.java， serviceImpl.java，controller.java, mapper.xml， sql, api.js, index.vue。

其中domain.java, mapper.java, mapper.xml, sql都是与数据库紧密相关的，domain即生成对应数据库表的类，mapper与sql中则包含数据库基本的增删改查。

我们来研究一下domain的生成逻辑。

通过F12调试，发现点击预览的接口为：`/tool/gen/preview/?id`， 如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25e8b58c328d4d5086a81a4055ce8e11~tplv-k3u1fbpfcp-watermark.image?)

接口代码经过查找，controller中如下：

```java
/**
     * 预览代码
     */
    @PreAuthorize("@ss.hasPermi('tool:gen:preview')")
    @GetMapping("/preview/{tableId}")
    public AjaxResult preview(@PathVariable("tableId") Long tableId) throws IOException
    {
        Map<String, String> dataMap = genTableService.previewCode(tableId);
        return AjaxResult.success(dataMap);
    }
```

通过逐层分解，我们找到其中的一些关键代码：

### mybatis的collections一对多查询

我们知道，`gen_table`中的一行数据对应`gen_table_column`中的多行数据，那么mybatis是如何查询这种结果的呢？

这里有一个很好的示例。

其关键代码如下所图所示（源代码位于项目`ruoyi-generator/resources/GenTableMapper.xml`中）

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162909d4fd514014903c582232518252~tplv-k3u1fbpfcp-watermark.image?)

具体的查询语句如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261d36aeb1c24e35b2141e7fcfc698f5~tplv-k3u1fbpfcp-watermark.image?)

如此，我们便将数据库中的一对多数据查询并映射为Java中的一个对象`GenTable`，如此便利于后续的代码生成操作。





