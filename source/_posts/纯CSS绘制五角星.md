---
title: 纯CSS绘制五角星
comments: true
date: 2021-08-18 18:25:51
categories:
tags:
---

这是我参与8月更文挑战的第18天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



## 问题起源

问题起源于最近在读的《CSS Secret》书籍中介绍了一个CSS属性，`clip-path`，没听过这个属性，所以略微研究了一下。

`clip-path`，MDN文档链接：https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path

官网释义：

> [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

如何理解这一点呢？`clip-path`可取哪些值呢？

## 各式各样的裁剪取值

### 可按照盒模型取值

根据MDN给的例子，我们可以取：`margin-box`，`border-box`，`padding-box`，`content-box`等等，各个取值含义如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0eb1e2548f34832b48a608c3a262935~tplv-k3u1fbpfcp-watermark.image)

### 函数

`clip-path`取的函数范围在MDN被定义为`<basic-shape>`，其中文翻译为`<几何盒>`。

函数包括：`inset()`, `circle()`, `ellipse()`, `polygon()`, `path()`。

本文题为“如何绘制五角星”，即如何绘制复杂的多边形，用到的函数是`polygon()`。

`polygon`，翻译为多边形，熟悉MATLAB绘图的小伙伴应该对这个函数不陌生，在MATLAB中`polygon`就是一个用来绘制二维多边形的函数。

那么，如何在在CSS中使用`polygon`绘制多边形呢？

## polygon

先来看[官网释义](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape)：

> `polygon( [<fill-rule>,]? [<shape-arg> <shape-arg>]# )`
> 
> 每一对在列表中的参数都代表了多边形顶点的坐标， *xi* 与 *yi* ，i代表顶点的编号，即，第i个顶点。

如何理解这句话呢？我们来看一个例子:

```html
<!DOCTYPE html>
<title>clip-path裁剪</title>
<body>
    <div class="box">
    </div>
</body>
<style>
    .box {
        width: 876px;
        height: 576px;
        background: url('https://cdn.pixabay.com/photo/2018/01/12/10/19/fantasy-3077928_960_720.jpg') no-repeat;
        background-size: 100% 100%;
        /* clip-path: polygon(50% 0, 50% 50%, 0 50%, 0 0); */
    }
</style>
</html>
```

在注释掉`clip-path`一行后，完整的展示样式如下图所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d74cab6ee464e6db5adb57beff58e15~tplv-k3u1fbpfcp-watermark.image)

当我们取消注释后，图又是什么样子的呢？

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/192d7f84fdd84df08fe4db9be276b453~tplv-k3u1fbpfcp-watermark.image)

可以看到图片只剩下左上角1/4的部分，其他部分都被裁剪掉了。不难理解，`polygon`的参数就是一个一个的多边形顶点坐标，即：

```css
clip-path: polygon(x1 y1, x2 y2, x3 y3, ....)
```

则五角星也很容易理解了，只要将其10个顶点坐标给出即可。

```
clip-path: polygon(50% 2.4%, 34.5% 33.8%, 0% 38.8%, 25% 63.1%, 19.1% 97.6%, 50% 81.3%, 80.9% 97.6%, 75% 63.1%, 100% 38.8%, 65.5% 33.8%);
```

效果如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a451bf95ae7349e0acd943520ed03a72~tplv-k3u1fbpfcp-watermark.image)

如果图形是正方形的，效果会更好。
