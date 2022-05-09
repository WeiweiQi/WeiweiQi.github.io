---
`title: 纯CSS输出渐变色
comments: true
date: 2021-08-12 18:25:36
categories:
tags:
---

这是我参与8月更文挑战的第12天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



CSS渐变色逃不过的一个函数就是`linear-gradient`

MDN官方文档：https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient()

linear-gradient定义为：

```css
linear-gradient(
  [ <angle> | to <side-or-corner> ,]? <color-stop-list> )
  \---------------------------------/ \----------------------------/
    Definition of the gradient line        List of color stops

where <side-or-corner> = [ left | right ] || [ top | bottom ]
  and <color-stop-list> = [ <linear-color-stop> [, <color-hint>? ]? ]#, <linear-color-stop>
  and <linear-color-stop> = <color> [ <color-stop-length> ]?
  and <color-stop-length> = [ <percentage> | <length> ]{1,2}
  and <color-hint> = [ <percentage> | <length> ]
```

这个含义看上去很复杂。

比如包括`angle`渐变方向，是从上到下渐变，还是从左向右渐变，还是以一定角度渐变。

`color-stop-list`定义的是渐变节点。

我们来看几个例子。

基础框架代码：

```css
<!DOCTYPE html>

<body>
    <div class="my-box"></div>
</body>

<style>
    .my-box {
        width: 300px;
        height: 300px;
        /* background: linear-gradient(#fb3, #58a); */
    }
</style>

</html>
```



1. 仅使用颜色：

```css
background: linear-gradient(#fb3, #58a);
```

效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d582abdaeb204affac2266e45c58e36c~tplv-k3u1fbpfcp-watermark.image)

2. 指定渐变节点

   如下代码所示，我们定义了4个渐变节点，其中第二个与第三个渐变节点的颜色相同。

```css
background: linear-gradient(#fb3 10%, #58a 50%, #58a 60%, red 80%);
```

展示效果如下所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7889792fa924c8a9de4ec9c3499d0e7~tplv-k3u1fbpfcp-watermark.image)

3. 指定渐变方向

   我们添加渐变方向，先来尝试一下角度问题：

   ```css
   background: linear-gradient(45deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
   ```

   展示效果如下所示，可以看到其中的`45deg`是左下角开始的。但究竟是从哪里转动的`45deg`呢？

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b37fab571b46b0a89c74243d411f0a~tplv-k3u1fbpfcp-watermark.image)

   尝试一下其他的角度，或者我们做一下动画看看：

   ```css
   <!DOCTYPE html>
   
   <body>
       <div class="my-box"></div>
   </body>
   
   <style>
       .my-box {
           width: 300px;
           height: 300px;
           background: linear-gradient(0deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           animation: change 3s infinite;
       }
       @keyframes change {
           from {
               background: linear-gradient(0deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           }
           25% {
               background: linear-gradient(11.25deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           }
           50% {
               background: linear-gradient(22.5deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           }
           75% {
               background: linear-gradient(33.75deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           }
           to {
               background: linear-gradient(45deg, #fb3 10%, #58a 50%, #58a 60%, red 80%);
           }
       }
   </style>
   
   </html>
   ```

   动画效果如下：

   ![499de5d0-e2f0-452d-bc47-96dca17e8b38.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7246cd574aaa4c3c9302cdc4c339d0ca~tplv-k3u1fbpfcp-watermark.image)

   可以看到其转换方向从是“从下到上”的方向开始，大约是以组件中心为圆心顺时针转动`45deg`。

   

   利用`linear-gradient`的特性可以做很多有意思的背景色或样式，如条纹等等。《CSS揭秘》中详细阐述了如何使用该属性做条纹以及做更复杂的背景图案。

   

