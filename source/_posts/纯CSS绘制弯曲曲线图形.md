---
title: 纯CSS绘制弯曲曲线图形
comments: true
date: 2021-08-19 18:41:05
categories:
tags:
---

这是我参与8月更文挑战的第19天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



## 问题起源

就在昨天，我们通过文章[纯CSS绘制五角星](https://juejin.cn/post/6997722260815478814)简单介绍了CSS中的一个截取属性值：`clip-path`可以按照指定的方式截取指定形状的图形，并且介绍了`clip-path`的两种取值：

1. 按照盒模型取值：`margin-box`，`border-box`等

2. 取函数，如`polygon`多边形函数，我们了解到可以通过如下方式绘制，或者说截取一个多边形：

   ```css
   clip-path: polygon(x1 y1, x2 y2, x3 y3, ....)
   ```

那么，`clip-path`还有哪些精妙的取值来绘制图形呢？

今天我们来认识一下其他函数。

## inset

改函数定义为截取一个矩形，4个参数分别表示距离外层盒模型的上、右、下、左边界的偏移量。类似`margin`、`padding`，也可以通过1,2,4个值来设定4个偏移量。（刚知道这种简略写法被称为：边际速记语法）。

如下所示，第二行类似`border-radius`，设置截图图形的4角的弧度。

```css
clip-path: inset(22% 12% 15px 30px);
clip-path: inset(22% 12% 15px 30px round 6px);
```

如图所示：

完整图形：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f92fcae5d804bbb9cc3ed6ac934276e~tplv-k3u1fbpfcp-watermark.image)

截图代码：

```css
clip-path: inset(10% 20% 20% 20% round 280px 10px 10px 280px);
```

截图效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ada73a0ce8a42bc9b826c5450949b4e~tplv-k3u1fbpfcp-watermark.image)



## circle

见字知意，截取一个圆形图案，函数参数解释如下所示：

```css
clip-path: circle(6rem at 0rem 0rem);
```

这段代码表示在盒模型中，以坐标`(0rem, 0rem)`的位置为圆心，已`6rem`长度为半径R，截图圆形图案。当然，这个位置截图的效果会是一个扇形。

仍然采用上图为原图，以下代码的截图效果：

```css
clip-path: circle(200px at 40% 40%);
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a54a4133a5f4843a84b86366d57f5e3~tplv-k3u1fbpfcp-watermark.image)

## ellipse

同样见字知意，绘制椭圆，其含义为：

```css
ellipse(x半径 y半径 as x y)
```

x, y表示圆心位置。对比`circle`并不难理解。

代码：`clip-path: ellipse(200px 100px at 40% 40%);`

截图效果如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/080701473a574cf0ace3f2b6af042160~tplv-k3u1fbpfcp-watermark.image)



## 遗留了一个未解决的问题

一个图形能否使用两个`clip-path`截取函数呢？

比如我对完整图形先使用`circle`截取，如何再对截图后的图案再次进行截取，CSS允许这样做吗？
