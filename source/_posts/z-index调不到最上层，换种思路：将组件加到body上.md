---
title: z-index调不到最上层，换种思路：将组件加到body上
comments: true
date: 2021-10-29 11:09:34
categories:
tags: 前端，VUE
---



这是我参与11月更文挑战的第1天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)



## 需求描述

在最近一次的实际生产项目中，需要紧急开发一个全屏播放窗体，设计大概是这个样子：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/002c4c2c6a3a44ef9800fd75892ee4dc~tplv-k3u1fbpfcp-watermark.image?)

需求描述为，点击视频或图片，将其放大或者播放在上图中的播放窗口中；下方区域居中显示对于图片或者视频的描述文字；黑色背景区域显示为覆盖全屏的黑色半透明窗体；右上角有播放关闭按钮，关闭后即关闭整个播放区域和黑色窗体背景；并且要求覆盖浏览器的返回按钮，返回时效果同点击关闭按钮。



## `z-index`的思路

最直接的想法，写一个组件，调用时组件的`z-index`设置为一个比较大的值。但是实际上，`z-index`使用是有局限性的。

在MDN官方文档中，[z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)属性设定了一个定位元素及其后代元素或 flex 项目的 z-order。 当元素之间重叠的时候， z-index 较大的元素会覆盖较小的元素在上层进行显示。

需要注意以下几点：

1. `z-index`只在当前堆叠的上下文中的层级，不同父元素的子元素之间进行显示时，会根据父级元素的`z-index`进行渲染；

2. 可以为负值；

3. 必须在`position`属性为：`relative`, `absolute`, `fixed`,  `sticky`中才生效；

   因此，有时单纯为了修改层级，而避免修改DOM的`position`还需要为`z-index`添加单独的DOM元素，甚至无法添加；当然，更多情况是，页面元素复杂，单纯使用`z-index`可能需要逐级修改父级的`z-index`，改动和记录量较大。

   也是因此，我们放弃了这一单纯使用`z-index`的思路。（实际是单纯使用`z-index`没有达到预期效果，总有几个东东在飘在页面上方，~~手动狗头~~，所以不单纯是告诉大家，也是自己做一下记录）

## `body.append`思路

即，创建组件时，改变组件的父级节点，直接将组件挂载在最外层的DOM树——`<body></body>`上，话不多数，上关键代码：

```javascript
mounted() {
    this.$nextTick(() => {
      const body = document.querySelector('body')
      if (body.append) {
        body.append(this.$el)
      } else {
        body.appendChild(this.$el)
      }
    })
  },
  destroyed() {
    const body = document.querySelector('body')
    body.removeChild(this.$el)
  },

```

通过上述代码，将该组件与系统现有的复杂层级组件抽离，从而达到置顶显示覆盖的最终效果。给自己点个赞！

通过这一思路，我们可以打开思路，即通过JS随意调整组件的挂载位置与层级，开不开心^_^。

完整代码如下：（其中一些class没有列出来，只是页面布局相关，如项目统计的左右边距，就不贴出来了）

```vue
<template>
  <div class="popContainer">
    <div style="width: 100%;height: 100%;" class="flex-col-center-end">
      <div class="main-area top-info center" style="height: 88%">
        <div style="width: 100%;height: 75%">
          <slot name="main" />
        </div>
      </div>
      <div class="bottom-info main-area center">
        <slot name="bottom" />
      </div>
    </div>
    <el-image :src="require('./叉.png')" class="close-icon pointer" @click="close" />
  </div>
</template>

<script>
export default {
  name: 'ModelFullScreen',
  data() {
    return {
      show: false
    }
  },
  watch: {
    show() {
      this.$emit('input', this.show)
    }
  },
  created() {
    this.show = this.value
  },
  mounted() {
    this.$nextTick(() => {
      const body = document.querySelector('body')
      if (body.append) {
        body.append(this.$el)
      } else {
        body.appendChild(this.$el)
      }
      console.log(body)
    })
    // ----------------------------后退相关------------------------------------
    // 挂载完成后，判断浏览器是否支持popstate
    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, document.URL) // 这里有没有都无所谓，最好是有以防万一
      window.addEventListener('popstate', this.goBack, false)
      // 回退时执行goback方法
    }
  },
  destroyed() {
    // const body = document.querySelector('body')
    // body.removeChild(this.$el)
    // 页面销毁时，取消监听。否则其他vue路由页面也会被监听
    window.removeEventListener('popstate', this.goBack, false)
    this.goBack()
  },
  methods: {
    close() {
      const body = document.querySelector('body')
      body.removeChild(this.$el)
      this.$emit('close')
    },
    goBack() {
      const body = document.querySelector('body')
      if (body) {
        body.removeChild(this.$el)
        this.$emit('close')
      }
      window.history.pushState(null, null, document.URL)
    }
  }
}
</script>

<style scoped>
  .popContainer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 50000;
    background: rgba(0, 0, 0, 0.9);
  }

  .close-icon {
    position: fixed;
    top: 10%;
    right: 10%;
    z-index: 50001;
  }

  .top-info {
    width: 100%;
    flex: 1;
  }

  .bottom-info {
    width: 100%;
    background: black;
    color: #AFAFAF;
    height: 12%;

    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
  }

</style>

```

