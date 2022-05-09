---
title: CSS动画-调速函数-steps
comments: true
date: 2021-08-28 16:33:31
categories:
tags:
---

这是我参与8月更文挑战的第28天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



在文章[CSS动画-调速函数](https://juejin.cn/post/7000669639055245325)一文中，我们初步了解了一下CSS调速函数`animation-timing-function`的作用，介绍了一个重要的调速函数参数`cubic-bezier(x1, y1, x2, y2)`，即贝塞尔曲线。在学习`animation-timing-function`[MDN文档](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)时，发现除了可以取贝塞尔曲线外，还有另外一个函数：`steps`，

## steps规范

具体规范如下：

```
steps(number_of_steps, direction)
```

其中，`number_of_steps`表示一个正整数，表示动画变化的步数/帧数，`direction`表示变化函数是否为左连续或右连续。`steps(2, jump-start)`的变化曲线如下所示：横轴表示动画的时间进度，竖轴表示动画的执行进度。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75c516b0bebd48bbbab8fd718f95161a~tplv-k3u1fbpfcp-watermark.image)

通过分析函数曲线，我们可以看到，在(0, 0)时，动画进度发生阶梯跳跃，即此时动画效果是瞬时完成的，相比通过贝塞尔曲线对动画进行平滑过度，什么情况下需要使用`steps`函数呢？

在《CSS Secret》中介绍了一种情况：**逐帧动画效果**

比如下图所示为一个人跳跃的逐帧动画图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dfd41640b714f1a9d706cd3e869c9c6~tplv-k3u1fbpfcp-watermark.image)

那么，如何通过CSS动画将这一动画演示出来呢？我们来尝试一下。

## 帧动画

首先来试一下如果使用贝塞尔曲线会是什么样子：

```html
<!DOCTYPE html>
<title></title>
<body>
    <div class="jump">

    </div>
</body>
<style>
    body {
        /* 居中 */
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .jump {
        height: 226px;
        width: 112px;
        background: url('./img/jump.png') 0 0;
        overflow: hidden;
        animation: loader 3s infinite;
    }
    @keyframes loader {
        to { background-position: -1009px 0; } 
    }

</style>
</html>
```

实现效果如下图：

![4d064d03-fd37-4400-b21f-dd4360d8d4b0.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3525048bc84ef29b9567e2d01a66e9~tplv-k3u1fbpfcp-watermark.image)

不管是使用`linear`或如何调整贝塞尔曲线参数，总是无法达成理想的动画效果。我们来试试如果使用`steps`有什么效果：

```css
animation: loader 1s infinite steps(9);
```



![13f15ec5-0aba-4daf-91a9-2f6366a844fd.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/922a404ec7824cc69ab93ec49d07ecd1~tplv-k3u1fbpfcp-watermark.image)

（嗯，请稍微忽略因截图问题导致的漏出来的一个脚）

可以看到动画效果非常不错了。

至于另外一个参数`direction`，我借用另外一篇[博客](https://segmentfault.com/a/1190000007042048)的一个动图，希望能帮助大家理解：

![3949005326-57ec7d2e67e8d.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d906cf363f6f47cba1f8a74dbf47b4aa~tplv-k3u1fbpfcp-watermark.image)
