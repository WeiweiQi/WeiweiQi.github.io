---
title: vue3特性学习
comments: true
date: 2021-06-21 18:59:03
categories: 前端
tags: 前端
---

这是我参与更文挑战的第22天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

不知不觉22天了，每天更文对自己来说真是一个挑战，从被掏空到主动学习

> 既然我们知道了**为什么**，我们就可以知道**怎么做** 

尤大说，要看文档，要看文档，要看文档。

[官方文档](https://v3.cn.vuejs.org/guide/migration/introduction.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E6%96%B0%E7%89%B9%E6%80%A7)

### setup

文档将`setup`、`ref`、`watch`等都介绍在“组合API”一节，个人对这个目前并没有太理解，等应用有了深刻理解再另写吧！

vue3新增了一个`setup`组件选项，在组件创建**之前**执行，`setup` 中不可使用 `this`，（文档中说“应该避免使用`this`”），因为`setup` 的调用发生在 `data` 、`computed` 、 `methods` 被解析之前，所以它们无法在 `setup` 中被获取。

```javascript
export default {
  components: { ... },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log(props) // { user: '' }
    return {} // 这里返回的任何内容都可以用于组件的其余部分
  }
  // 组件的“其余部分”
}
```

### ref

ref: 响应式变量。如下所示，如此可使得变量`counter`变为一个在任何地方起作用的响应式变量。

```js
import { ref } from 'vue'
const counter = ref(0)
console.log(counter) // { value: 0 }
```

将值封装在一个对象中的理由，文档中给了一个很生动的Gif动画，[非常有意思](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E5%B8%A6-ref-%E7%9A%84%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8F%98%E9%87%8F)。

### 全局/外部`watch`函数

不知道算不算vue3的新特性，不过我之前没有使用过这一函数，姑且罗列出来。

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
// 监听counter，当counter发生修改时，执行回调函数。
```

### 全局/外部`computed`属性

```js
import { ref, computed } from 'vue'
const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)
```

### Teleport

经过文档阅读，我的理解是**Teleport允许给组件的部分DOM指定父组件**，比如将组件的一部分渲染至页面的html/body下。

```html
<teleport to="body">
     <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
     </div>
</teleport>
```

### 片段

简单来说，组件中的`<template><div>..</div></template>`，其中`<div></div>`可以不写了。

### 自定义事件

允许给`emit`事件编写验证函数。

