---
title: 纯CSS生成毛玻璃
comments: true
date: 2021-08-14 16:01:33
categories:
tags:
---

这是我参与8月更文挑战的第14天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)

今天我们尝试使用CSS绘制一个毛玻璃效果，在学习过程中，可以了解到CSS的几个属性：

```css
filter: blur(模糊半径); // 元素模糊
background: hsla(色相, 饱和度, 亮度, 透明度)
```

### blur

CSS中有一个`blur()`函数可以生成模糊效果，如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46cae99ce9734c4393dece8c8cbb6c82~tplv-k3u1fbpfcp-watermark.image)

上图基本代码：

```html
<!DOCTYPE html>
<title>毛玻璃效果</title>
<body>
    <div class="background-box">
        <div class="txt-box">
            文字内容
        </div>
    </div>
</body>
<style>
    .background-box {
        width: 700px;
        height: 500px;
        background: url('https://cdn.pixabay.com/photo/2021/07/14/09/14/siberian-cat-6465485_960_720.jpg') no-repeat;
        background-size: 100% 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        filter: blur(4px);
    }

    /* .txt-box {
        width: 300px;
        height: 200px;
        background: white;
        filter: blur(4px);
    } */
</style>
</html>
```



blur函数官方释义：https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter-function/blur()

但是blur会使得整个元素都变得模糊，无法生成我们想要的毛玻璃效果。

### 使用半透明背景

最基本最简单的方式，使用半透明背景，如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4f280a2d89f4d4c9dfa86844238cc4a~tplv-k3u1fbpfcp-watermark.image)

基础代码：

```html
<!DOCTYPE html>
<title>毛玻璃效果</title>
<body>
    <div class="background-box">
        <div class="txt-box">
            文字内容, 毛玻璃效果
        </div>
    </div>
</body>
<style>
    .background-box {
        width: 800px;
        height: 600px;
        background: url("https://cdn.pixabay.com/photo/2021/07/14/09/14/siberian-cat-6465485_960_720.jpg") no-repeat;
        background-size: 100% 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .txt-box {
        width: 600px;
        height: 400px;
        /*关键代码*/
        background: hsla(0,0%,100%,.3);

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
</html>
```

通过调整半透明颜色调整透明度，动画效果如下所示：

![f63f8b1a-82fc-4cfc-b514-c817852658ef.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0b29172e78d49659b2165bf18e85d82~tplv-k3u1fbpfcp-watermark.image)

但是这种效果并不理想，透明度高的时候文字不易阅读，透明度太低视觉效果不好。

### 半透明

我们使用伪元素在原文字区域下方生成一个同样大小的半透明区域背景，来看下效果：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35ba74764b5e490f81c3d5bbc0e0ef25~tplv-k3u1fbpfcp-watermark.image)

```css
.txt-box::before {
        z-index: -1;/*将背景设置于文字之下*/
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(255, 0, 0, .5);
    }
```

然后我们将外层的背景图片加载到伪元素上：（为了便于区分，我们给伪元素添加了一层边框）

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d2eced57f904c059f1c9bb1eaca7dd2~tplv-k3u1fbpfcp-watermark.image)

然后我们对伪元素添加模糊效果：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c4a311b2b8842a9b5c13147c37e5bd7~tplv-k3u1fbpfcp-watermark.image)

实际上，这时已经是非常好的毛玻璃效果了。



通过学习《CSS Secret》书籍，其中阐述到这种效果，作者仍然不满意毛玻璃的边框区域，仍然有改进空间。

后续通过`margin: -30px`扩大伪元素模糊范围，以及文字元素`overflow: hidden`切割超出部分，从而实现完美的毛玻璃效果，如下所示。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2defbd8ddea4390965de9a4337d8304~tplv-k3u1fbpfcp-watermark.image)



在学习过程中遇到一个新的属性：`background-attachment`，官方链接：(https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment)

> `background-attachment`  [CSS](https://developer.mozilla.org/en-US/docs/CSS) 属性决定背景图像的位置是在视口内固定，或者随着包含它的区块滚动。
>
> 可取值：fixed, scroll, local

## 总结

1. 当背景图不适合`background-attachment: fixed`时，需要使用简单的给文本元素添加透明度即可，虽然不完美。

2. 当背景图可以使用`background-attachment: fixed`，此时可以使用比较复杂的方法：

   ```
   1. 在文字与背景之间，添加一层元素（伪元素或者DOM元素）
   2. 该层元素与文字元素大小相同，且其背景与最外层背景完全重合。
   3. 对该层背景设置filter: blur(*)模糊效果
   4. 通过模糊层元素外边距与文字元素的`overflow: hidden`生成边界清晰的毛玻璃边界
   ```

   
