---
title: 《CSS揭秘》阅读笔记
comments: true
date: 2021-07-12 08:36:49
categories: 前端
tags: CSS
---

「本文已参与好文召集令活动，点击查看：[后端、大前端双赛道投稿，2万元奖池等你挑战！](https://juejin.cn/post/6978685539985653767)」

>  理解发现解决方案的过程比解决方案本身更有用

## 尽量减少代码重复

### 尽量减少改动时要编辑的地方

#### 尺寸: 放大一个组件，你的CSS需要改动几处

当某些值相互依赖时，应该把它们的相互关系用代码表达出来。

作者推荐**使用百分比或者em单位**。比如：

```css
font-size: 20px;
line-height: 1.5;
```

可以修改为：

```css
font-size: 125%;
line-height: 1.5;
```

通过使用`em`，组件可达到按照字体大小缩放的目的。

> 在[MDN Web Doc](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Values_and_units)中，关于`em`的定义：
>
> `em`：相对长度单位，在 `font-size` 中使用是相对于父元素的字体大小，在其他属性中使用是相对于自身的字体大小，如 `width`

另外一个类似的相对长度单位：`rem`：

> 在[MDN Web Doc](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Values_and_units)中，关于`rem`的定义：
>
> `rem`：相对长度单位，根元素的字体大小

当然，其中不希望随着缩放变化的，可以使用绝对长度单位，如边框宽度`border-width`。

#### 颜色: 暗色与亮色背景上，如何改动组件颜色？

只要把半透明的黑色或白色叠加在主色调上，即可产生主色调的亮色和暗色变体，这样就可以轻松化解这个难题。

> 半透明白色：`rgba(255, 255, 255, 0.5)`或`hsla(0, 0%, 100%, 0.5)`，
>
> 半透明黑色：`rgba(0, 0, 0, 0.5)`或`hsla(0, 0%, 0%, 0.5)`；
>
> 其中最后的透明度可根据实际进行调整。

分别在白色与黑色背景上设置半透颜色、半透投影效果如下图所示。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2897c727f55c43e7873a3874edac0b50~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad823fd931604e6da3282b469042f333~tplv-k3u1fbpfcp-watermark.image)

通过在原有组件上设置`background: background-color, backgound-image`,即可轻松通过覆盖`background-color`得到不同版本的按钮：

####  CSS中的变量 `currentColor`

`currentColor`会被解析为当前字体的颜色`color`的值，据《CSS揭秘》中说，该值为CSS 中有史以来的第一个变量。

### 相信你的眼睛，而不是数字

文中提到：**视觉错误在任何形式的视觉设计中都普遍存在**。设计是针对人的，而不是机器。

相关技巧包括：

1. 垂直居中时，将物体从几何学中心点再稍微向上挪一点；
2. 圆形的组件稍微放大一些，才会看起来与矩形的大小相同；
3. 相对左右两侧内边距，稍微减少顶部与底部的内边距，使得其看起来相同。

### 关于响应式页面设计

>  **思路是尽最大努力实现弹性可伸缩的布局，并在媒体查询的各个断点区间内指定相应的尺寸。**

#### 何时应该使用媒体查询：

其他尝试都失败了；或者希望在较大或较小的视口下完全改变网站的设计。

#### 避免媒体查询的几点建议：

我们摘录其中的几点：

> 1. 使用百分比长度来取代固定长度：%，vw, vh, vmin, vmax。
> 2. 假如背景图片需要完整地铺满一个容器，不管容器的尺寸如何变化，`background-size: cover` 这个属性都可以做到。
> 3. 当图片（或其他元素）以行列式进行布局时，让视口的宽度来决定列的数量。
> 4. 在使用多列文本时，指定`column-width`（列宽）而不是指定`column-count`（列数）.

### 合理使用简写

合理使用简写是一种良好的防卫性编码方式，可以抵御未来的风险。

```css
background: url(tr.png) no-repeat top right / 2em 2em,
 		   url(br.png) no-repeat bottom right / 2em 2em,
		   url(bl.png) no-repeat bottom left / 2em 2em;
```

可以通过 **CSS 的“列表扩散规则”：如果只为某个属性提供一个值，那它就会扩散并应用到列表中的每一项**，改写为以下代码：

```css
background: url(tr.png) top right,
 		   url(br.png) bottom right,
 		   url(bl.png) bottom left;
background-size: 2em 2em;
background-repeat: no-repeat;
```

### 关于预处理器

CSS预处理器：

1. Stylus（http://stylus-lang.com/）
2. Sass（http://sass.lang.com/）
3. LESS（http://lesscss.org/）

它们在大型项目中可以让代码更加灵活。

文中提到，它们可能使得解析出的CSS文件的体积和复杂度失控；同时，这些预处理器也可能存在bug。

