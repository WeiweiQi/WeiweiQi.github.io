---
title: 纯CSS如何简洁的实现多边框
comments: true
date: 2021-08-10 18:23:53
categories:
tags:
---

这是我参与8月更文挑战的第10天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



双重边框甚至多重边框是设计上的常用样式，如何用代码实现呢？

## 层叠DOM元素

最原始的方法自然是可以通过层叠不同背景色的DOM元素来实现，通过调整DOM元素的大小和背景色从而实现设置多重边界的目的。

比如要实现两个边框，则需要至少编写两个包裹的DOM，内层DOM设置border为第一层边框，内层覆盖外层后，外层漏出的部分显示为外层边框。

实现效果如下图所示：为了说明层叠DOM效果，添加了一个动画效果。

![147ee4ba-3fce-4f02-8a44-ffb733f61f5a.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6f0a7b59fd742b3bd88a8048bc65d2c~tplv-k3u1fbpfcp-watermark.image)

具体实现代码如下所示：

```html
<!DOCTYPE html>

<body>
    <div class="outer">
        <div class="inner"></div>
    </div>
</body>
<style>
    body {
        background: black;
    }

    .outer {
        background: lightblue;
        width: 300px;
        height: 300px;
        margin: 50px;
        position: relative;
    }

    .inner {
        background: lightcoral;
        width: 200px;
        height: 200px;
        border: 25px solid lightgreen;
        position: absolute;
        top: 25px;
        left: 500px;
        animation: move 10s infinite;
    }

    @keyframes move {
        from {
            left: 500px;
        }
        to {
            left: 25px;
        }
    }

</style>

</html>

```



但是这种方法繁琐，且如果更多边框的话会造成DOM过多，代码一点儿都不优雅，不好，不好！



## CSS除border外其他实现边框的方式



CSS除border外是否还有其他实现边框的方式呢？有的。

### outline

该属性为设置DOM的轮廓。

MDN官方文档：https://developer.mozilla.org/zh-CN/docs/Web/CSS/outline

outline是`outline-color`，`outline-style`，`outline-width`的简写。

> [border](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border) 和 outline 很类似，但有如下区别：
>
> - outline不占据空间，绘制于元素内容周围。
> - 根据规范，outline通常是矩形，但也可以是非矩形的。

### box-shadow

box-shadow是添加阴影的，那么怎么用它设置边框呢？

该属性可设置的值包括阴影的X轴偏移量、Y轴偏移量、模糊半径、扩散半径和颜色，X轴偏移量、Y轴偏移量、模糊半径均设置为0，仅设置扩散半径与颜色，则效果与边框是一样的。

而且，根据《CSS Secret》中阐述，box-shadow支持逗号分隔，如：`box-shadow: 0 0 0 10px #655, 0 0 0 15px deeppink;`,

如何可以很方便的给元素添加多重边框。

如下图为一个复杂的多重边框图案，但是其代码十分简单

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d271e86512543709fbcba3888dd92e3~tplv-k3u1fbpfcp-watermark.image)

实现代码：

```html
<!DOCTYPE html>

<body>
    <div class="my-transparent">11111</div>
</body>
<style>
    body {
        background: black;
    }
    .my-transparent {
        margin-left: 100px;
        margin-top: 100px;
        
        border-radius: 10px;
        background: white;
        width: 300px;
        height: 300px;
        /*核心代码*/
        border: 10px solid hsla(0,0%,100%,.5);
        outline: 10px solid deeppink;
        box-shadow: 0 0 0 20px white, 0 0 0 30px green, 0 0 0 40px yellow, 0 0 0 50px blue;
    }
</style>
</html>
```







