---
title: 加速网站速度的建议之CSS篇
comments: true
date: 2021-06-29 11:27:02
categories: 前端
tags: 前端
---

这是我参与更文挑战的第29天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

继Cookie篇后，继续学习如何加速网站。

## CSS

### 将样式表放在顶部

把样式表放在`head`部分，可以实现页面的逐步渲染，使得浏览器能够尽快显示部分内容。如同进度条一般，能够提高用户体验。这也是HTML规范的一部分。

> 当样式表在底部时，部分浏览器，如IE，阻止页面渲染以避免其随着样式加载不得不重新绘制，因此，页面未加载完全时，用户只能看到一个空白的白色页面。

### 避免使用CSS-expression

什么是CSS-expression呢？

```css
background-color: expression( (new Date()).getHours()%2 ? "#B8D4FF" : "#F08A00" );
```

根据例子可以列举为CSS中嵌入了javascript。大多数翻译为"CSS表达式"，目前已被废弃的一种CSS属性，只在IE5~IE7支持，IE8就已经废弃。

CSS-expression被废弃的主要原因是，不仅在页面渲染和调整大小时被重新执行，在页面滚动时、鼠标移动时，其也会被执行，有严重的性能问题。

这一点了解一下即可，现在一般不会遇到这种情况。

### 使用`<link>`代替`@import`

IE中使用`@import`与在页面底部使用`<link>`相同，如本文第一条所言，应避免这种情况。

关于两者更多的区别：

以下内容参考了博客园的一篇博客：https://www.cnblogs.com/my--sunshine/p/6872224.html

1. `@import`属于CSS规则，而`<link>`属于html标签。
2. 加载顺序：`<link>`引入的 CSS 与页面同时加载；`@import`引入的 CSS 在页面加载完毕后才被加载。
3. `@import`是 CSS2.1 +的语法，要求浏览器IE5+；`link`标签作为 HTML 元素，不存在兼容性问题。
4. 可通过 JS 插入`link`标签来改变样式，而`@import`不支持。
5. `<link>`引入的样式权重大于`@import`引入的样式。

### 避免过滤器

似乎也是一个古老的问题。

避免使用IE CSS过滤器：AlphaImageLoader。

了解了一下，这个过滤器是IE8之前版本的，用于设置背景图片的特效样式。

## 掘金首页CSS

我们通过Chrome查看源代码查看掘金首页的CSS情况。

如图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0266d63d68e647e3a07ef00a6fc9dd16~tplv-k3u1fbpfcp-watermark.image)

发起其`<Head>`中存在link标签。未发现使用`@import`。

```html
...
<link data-n-head="ssr" rel="stylesheet" href="https://b-gold-cdn.xitu.io/ionicons/2.0.1/css/ionicons.min.css"><link data-n-head="ssr" rel="stylesheet" href="https://b-gold-cdn.xitu.io/asset/fw-icon/1.0.9/iconfont.css">
...
```



1. [加速网站速度的建议之内容篇](https://juejin.cn/post/6977637802477355021)

2. [加速网站速度的建议之服务器篇一](https://juejin.cn/post/6977948072940666910)

3. [加速网站速度的建议之服务器篇二](https://juejin.cn/post/6978486791146110989)

4. [加速网站速度的建议之Cookie篇](https://juejin.cn/post/6978781086226579469)
