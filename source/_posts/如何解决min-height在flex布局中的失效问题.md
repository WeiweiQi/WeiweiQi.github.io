---
title: 如何解决min-height在flex布局中的失效问题
comments: true
date: 2021-07-15 09:57:15
categories:
tags:
---

「本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767)」

## 问题复现

首先来看一段简单的网页代码，使用`min-height`控制A区域的最小高度为父节点的50%。

```html
...
<body class="body">
    <div class="parent">
        <div class="child-a">
            A: min-Height: 50%;
        </div>
        <div class="child-b">
            B: flex: 1
        </div>
    </div>
</body>
...
```

其相关样式表代码如下：

```css
<style>
    .body {
     height: 300px; /*充满整个屏幕*/
     width: 300px;
}

.parent {
    min-height: 100%;  /*parent充满整个body*/
    display: flex; 
    flex-direction: column;
    border: 1px solid black;
}

.child-a {
    min-height: 50%; /*期待：A至少能充满半个区域*/
    background-color: cornflowerblue;
}

.child-b {
    flex: 1; /* 其他B填充除A外parent的剩余空间*/
    background-color:bisque;
}

```

**期待**效果图如下图，希望通过`min-height`使得A至少占满50%的空间。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2becfc1c96864b5d816ef0e6d3268318~tplv-k3u1fbpfcp-watermark.image)

然而，**实际**效果图却是下图这样：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e27e7a16ea634a9bad558b56e729ed6d~tplv-k3u1fbpfcp-watermark.image)



为什么A区域的`min-height`没有如我们所愿呢？

## 查找问题

我们试图通过查看`min-height`的定义来定位问题。

在[CSS官方文档](https://www.w3.org/Style/CSS/current-work.en.html)中，我们查找到`min-height`的[定义与解释](https://drafts.csswg.org/css2/#propdef-min-height)，其中提到，**当其取值为百分比时，其高度是根据父节点（准确的说是包含块）的高度计算的，如果没有明确指定包含块的高度，并且该元素不是绝对定位的，其高度将取决于内容高度**。

原文如下：

> `<percentage>`
>
> Specifies a percentage for determining the used value. The percentage is calculated with respect to the height of the generated box’s [containing block](https://drafts.csswg.org/css2/#containing-block). If the height of the containing block is not specified explicitly (i.e., it depends on content height), and this element is not absolutely positioned, the percentage value is treated as 0 (for [min-height](https://drafts.csswg.org/css2/#propdef-min-height)) or [none](https://drafts.csswg.org/css2/#valdef-max-height-none) (for [max-height](https://drafts.csswg.org/css2/#propdef-max-height)).

换句话说，当父节点的`height`未设置，而`min-height`为百分比取值时，其没有可依赖计算的基础值，因此无法计算其高度。此时按照CSS规范，元素的高度将由内部元素来决定。当 `min-height` 大于 `max-height`或 `height`时，元素的高度会设置为 `min-height` 的值。

## 解决问题

### 1. 给父节点设置`height`

我们给父节点`parent`设置`height:1px`即可。关于`height`与`min-height`、`max-height`的优先级，我们文章最后再说。

```css
.parent {
    /*新增一行，使得子节点的百分比值可以计算*/
    height: 1px;
    
    /*parent原css...*/
}
```



### 2. 给父节点外再加一层，并设置最外层`display:flex`

这一点我**不知道原因**，只是在查找过程中发现，这样也可以解决问题，所以列在此处，**请读者指点**。

一个可参考的文章：[Normalizing Cross-browser Flexbox Bugs](https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/)

如果发现节点的宽度也受到影响，增加`width`相关设置调整即可。

```css
.body {
    /*新增一行*/
    display: flex;
    
    /*原css不变...*/
}
```

### 3. 设置为绝对布局：absolute

这一点是根据定义来的，当元素为绝对定位时，百分比的设置`min-height`也可以生效。（若影响了`width`，添加相关属性）

虽然这种方式可以解决`min-height`的问题，但是引入绝对布局，无疑会将页面变复杂。**不可取！**

```css
.parent {
    position: relative;
    ...
}

.child-a {
    position: absolute;
}
```



## 优先级

`height`与`min-height`， `max-height`的优先级可以通过简单的代码来测试，结果表明：**当`height`<`min-height`或者 `max-height`< `min-height`时，其高度的实际取值为`min-height`。**

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52ba0fa9cc60476c9cf833afb60f72ce~tplv-k3u1fbpfcp-watermark.image)
