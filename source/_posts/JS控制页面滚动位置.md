---
title: JavaScript控制页面滚动位置
comments: true
date: 2021-08-09 18:12:56
categories:
tags:
---



这是我参与8月更文挑战的第9天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



生产实际中产长有这样的设计：点击某横向栏的某个标签或链接，页面滚动到指定版块位置。如下图所示，为京东首页的一个设计，右侧栏列出的页面版块，随着用户点击，可以快递到达页面指定位置，从而实现快速定位。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce412dc2abc6492ba3a1d384a9d6d726~tplv-k3u1fbpfcp-watermark.image)



那么如何实现这种设计呢？



本文介绍两种实现方式：



## 使用scrollIntoView函数

见字知义，scrollIntoView()方法会使元素对用户可见。其官方文档链接：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView

使用实例效果：

![d804d6c4-b009-42df-bdc3-00e96f56f88b.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52ee1f0c04344513ae28ecd49f1937b8~tplv-k3u1fbpfcp-watermark.image)



实现代码：



```html
<!DOCTYPE html>
<script  type="text/javascript">
    function myscroll() {
        // console.log("dd");
        document.getElementById('e8').scrollIntoView();
    }
</script>
<body>
    <div class="fixed">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <input type="button" onclick="myscroll()" value="8" />
        <div>9</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>
        <div>13</div>
        <div>14</div>
    </div>
    <div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div id="e8">8</div>
        <div>9</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>
        <div>13</div>
        <div>14</div>
    </div>
    
</body>
<style>
    body {
        font-size: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .fixed {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        position:fixed;
        top: 0;
        right: 20%;
    }
</style>

</html>
```



放在VUE中，实现代码如下：

```vue
<template>
	....
	<div ref="element" @click.native="scroll">
        
    </div>
	....
</template>
<script>
...
	methods: {
        scroll() {
            this.$refs.element.$el.scrollIntoView()
        }
    }	
...
</script>
```





## 使用Window.scrollTo函数

window.scrollTo函数官方文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo

使用这个函数可以实现或平滑，或瞬时的滚动效果，且可以灵活的控制滚动距离。

```javascript
// 设置滚动行为改为平滑的滚动
window.scrollTo({
    top: 1000,
    behavior: "smooth"
});
```

近期在VUE中实现的一个例子如下所示：

```javascript
elementToView(ref) {
      let y = this.$refs[ref].$el.offsetTop
      /*注释部分代码实现的是由于点击组件可能在滚动过程中position变为fixed而引起的组件距离顶部的变化而做的动态修改*/
      // if (this.fixed || ref === 'overview') {
      //  y = y - this.tabRowHeight
      // } else {
      //  y = y - this.tabRowHeight * 2
      // }
    	// 关键在这里
      window.scrollTo(0, y)
    }
```





最初实现这个过程中遇到很多问题，还好都解决了，尤其是DOM各个值的含义，检索过程中的文章列在下面：



1. [令人头疼的clientTop、scrollTop、offsetTop](https://www.cnblogs.com/gagarinwjj/p/conflict_client_offset_scroll.html)









