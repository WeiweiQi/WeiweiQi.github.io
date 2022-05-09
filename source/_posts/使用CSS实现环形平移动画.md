---
title: 使用CSS实现环形平移动画
comments: true
date: 2021-11-02 17:59:56
categories:
tags: CSS
---

这是我参与11月更文挑战的第2天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)

## 问题起源

好久没写文章，回顾文章发现之前“[纯CSS绘制一个美美哒月亮](https://juejin.cn/post/7007381533195501576)”我是让单个月亮动起来，看到好多小伙伴能绘制美美的月绕地旋转，地绕日旋转，很漂亮，好像还有一篇嫦娥绕月的。自己也想实现一番。

又联想到最近读的《CSS Secret》(CSS揭秘)中，有一节“沿环形路径平移的路径”。动手动手。

## 上手思路

首先，利用`animation`的`rotate`将图形旋转起来，然后再考虑如何使它保持平移方式。上代码：

```html
<!DOCTYPE html>

<head>
    <title>环形平移动画</title>
</head>

<body>
    <div class="cirl-box">
        <img class="avtar"
            src="https://p3-passport.byteacctimg.com/img/user-avatar/985fdb8019434c98a2d1ef549dc59fef~300x300.image" />
    </div>
</body>
<style>
    body {
        width: 100%;
        height: 100vh;
        background: lightblue;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .cirl-box {
        border: 2px solid black;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        /* margin: 100px 100px; */
    }

    .avtar {
        width: 7.5rem;
        height: 7.5rem;
        background-color: #f9f9f9;
        border-radius: 50%;
        object-fit: cover;
        animation: spin 3s infinite linear;
        transform-origin: 200px 200px;
    }

    @keyframes spin {
        to {
            transform: rotate(1turn);
        }
    }

</style>

</html>

```

起始位置如图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da93c13059dd4db5a3980e15cb79d343~tplv-k3u1fbpfcp-watermark.image?)

动画效果如下图：

![1b5e3040-b298-46eb-a911-55b4e776fb37.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0eb1b94d32b4460a77fdd650f2fb1f8~tplv-k3u1fbpfcp-watermark.image?)

可以看到随着头像旋转，头像本身也在随着旋转，从而使得头像在其他位置“歪”了！按照书中的说法，这叫做：“没有保持自己本来的朝向”。

实现平移的一种方式时，对头像本身加另一个动画，使得其向相反的方向旋转一定的角度，如下图：

![042cdf87-11be-4839-a530-ddd32c708214.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e8ef14d48354bae8e16bbffffa21749~tplv-k3u1fbpfcp-watermark.image?)

如果将两个动画均加载上去，效果如何呢，看效果：

![f073ff1c-e0cf-40e6-9284-c616b6b0b511.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32144f63a53941c5b342e25913d9d794~tplv-k3u1fbpfcp-watermark.image?)

哇，实现了！

上代码：

```html
<!DOCTYPE html>

<head>
    <title>环形平移动画</title>
</head>

<body>
    <div class="cirl-box">
        <div class="cirle-move">
            <img class="avtar"
                src="https://p3-passport.byteacctimg.com/img/user-avatar/985fdb8019434c98a2d1ef549dc59fef~300x300.image" />
        </div>
    </div>
</body>
<style>
    body {
        width: 100%;
        height: 100vh;
        background: lightblue;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .cirl-box {
        border: 2px solid black;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        /* margin: 100px 100px; */
    }

    .avtar {
        width: 7.5rem;
        height: 7.5rem;
        background-color: #f9f9f9;
        border-radius: 50%;
        object-fit: cover;
        animation: spin-reverse 3s infinite linear;
    }

    .cirle-move {
        animation: spin 3s infinite linear;
        transform-origin: 200px 200px;
    }

    @keyframes spin {
        to {
            transform: rotate(1turn);
        }
    }

     @keyframes spin-reverse {
        to {
            transform: rotate(-1turn);
        }
    }

</style>

</html>

```



## 代码优化

根据《CSS Secret》的说法，代码不够简练，并且后续内容让我们了解到一个新的CSS动画属性：`animation-direction `,

在MDN的官方解释中说：

```
animation-direction CSS 属性指示动画是否反向播放
```

可选值有：normal, reverse, alternate, alternate-reverse。

```
normal：每个循环内动画向前循环，换言之，每个动画循环结束，动画重置到起点重新开始，这是默认属性。

alternate：动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，`ease-in` 在反向时成为 `ease-out`。计数取决于开始时是奇数迭代还是偶数迭代

reverse:反向运行动画，每周期结束动画由尾到头运行。

alternate-reverse：反向交替， 反向开始交替。动画第一次运行时是反向的，然后下一次是正向，后面依次循环。决定奇数次或偶数次的计数从1开始。
```

我们只使用一个旋转动画来看看各个值的效果。

**normal**：

![f035f9ed-5521-4df4-8846-ca2aef4ec93a.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e554b72b5dd4a48ac91e6c243dbe685~tplv-k3u1fbpfcp-watermark.image?)

**reverse**：

![16f5ca18-c031-49a2-99a2-6be5af9c22e5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d771849b67ab4b2eaef0073eff95afc4~tplv-k3u1fbpfcp-watermark.image?)

**alternate**：

![ed46fcdd-ab5e-4dd9-904f-198afe60bdac.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/642c287cd6234218a6f2bcdd1c6b3cd4~tplv-k3u1fbpfcp-watermark.image?)

**alternate-reverse**：与alternate的差别在于第一次的起始方向不同。

![2431efe6-364c-4fde-af8c-291c22214084.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c210b9a768a47e2aa5cdcfa1b6b9744~tplv-k3u1fbpfcp-watermark.image?)

那么如何使用这一个值简化代码呢？将子元素的动画属性设置为继承：`inherit`，只通过设置一个`animation-direction: reverse`即可实现，效果与上文实现效果一模一样，就不再贴图了。





