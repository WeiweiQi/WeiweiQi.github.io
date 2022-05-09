---
title: 纯CSS生成平行四边形
comments: true
date: 2021-08-16 17:45:41
categories:
tags:
---

这是我参与8月更文挑战的第16天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



## 毛玻璃效果后续

在介绍如何生成平行四边形之前，之前我的一篇文章[纯CSS生成毛玻璃效果](https://juejin.cn/post/6996224456414724104)，有用户评论说`backdrop-filter: blur(xxx);`这个属性。

所以先来了解一下这个`backdrop-filter`是个什么样的属性？

先来看一下效果，如下图所示，可以说非常不错。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6653d1cf37f4087bb48b48c1f2cce84~tplv-k3u1fbpfcp-watermark.image)

完整代码：

```html
<!DOCTYPE html>
<title>毛玻璃效果</title>

<body>
    <div class="background-box">
        <div class="txt-box">
            文字内容, 毛玻璃效果:
            backdrop-filter: blur(20px);
        </div>
    </div>
</body>
<style>
    .background-box {
        width: 800px;
        height: 600px;
        background: url("https://cdn.pixabay.com/photo/2021/07/12/19/49/landscape-6421773__340.jpg") 0 / cover fixed;
        /* background-attachment: fixed; */

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .txt-box {
        z-index: 2;
        width: 600px;
        height: 400px;
        font-size: 20px;
        font-weight: bold;
        /* background: hsla(0, 0%, 100%, .3); */

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(20px);
    }

</style>

</html>
```

至此，我们又学会了一种简易的生成毛玻璃效果的方法！！！感谢[Forx-Js](https://juejin.cn/user/3333374984859037)。

## 平行四边形

`transform`可用函数中有个叫`skew`, 相关的还有`skewX`, `skewY`，我们来看一下效果。

![55ca0f35-a63a-440f-b8df-3357922bcaba.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf234d81b82a490db1ccae978a808067~tplv-k3u1fbpfcp-watermark.image)

![26736fdd-66ae-479f-8db7-798bbb92aa29.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37b6dc1aad164b17adb3f92bf4b305a6~tplv-k3u1fbpfcp-watermark.image)

![fa8a7097-a57d-4e2c-917d-ddf8a03f04db.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7301af0479bb402f92a83792d23674d7~tplv-k3u1fbpfcp-watermark.image)

但是存在一个严重的问题是文字也会随着整体变形而变形，那么如何使得文字不变动，只让图形变动呢？根据[毛玻璃](https://juejin.cn/post/6996224456414724104)那篇文章的想法，我们将有色图形设置为文字元素下一层`z-index: -1`的伪元素，对伪元素使用skew函数使得其发生变形，而文字本身的DOM并不变，来看一下效果：

![5d142c9b-6ce3-4c29-aaaf-883ab4165e6e.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32ed3a48d1644b5e9599d87da1ebd383~tplv-k3u1fbpfcp-watermark.image)

源代码如下所示：

```html
<!DOCTYPE html>
<title>平行四边形</title>
<body>
    <div class="box">
        skewX(-45deg)
    </div>
</body>
<style>
    body {
        width: 100%;
        height: 100vh;

        /*居中*/
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .box {
        height: 200px;
        width: 400px;
        font-size: 30px;

        /*居中*/
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        transform: skew(0, 0);
        
        position: relative;
        border: 1px solid black;
        
    }
    .box::before {
        animation: skew 3s infinite;
        background-color: lightblue;
        content: ''; /* 用伪元素来生成一个矩形 */
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: -1;
        background: lightblue;
    }

    @keyframes skew {
        from {
            transform: skewX(0);
        }

        to {
            transform: skewX(-45deg);
        }
    }


</style>
</html>
```



