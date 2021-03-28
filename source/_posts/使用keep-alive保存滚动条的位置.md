---
title: 使用keep-alive保存滚动条的位置
comments: true
tags: 'VUE, Keep-alive'
abbrlink: 43685
date: 2020-10-17 14:14:36
categories:
---

一种是通过vue-router/activated保存和恢复组件的整体滚动条位置，一种是通过deactivated/activated保存组件内部某个组件的滚动条位置

<!-- more -->


一、组件整体的滚动条

1. keep-alive内部组件添加id标识，以便后期设置scrollTop


```html
    <!-- AppMain.vue -->
    <keep-alive :include="cachedViews">
        <router-view :id="id" :key="key" />
    </keep-alive>
```

2. 路由组件添加暂存scrollTop字段

重点代码在于增加**scrollTop: 0**.
```javascript
    {
      path: 'order_summary',
      component: () => import('@/views/ordermanage/OrderSummary'),
      name: 'OrderSummary',
      meta: { title: '订单数据汇总', icon: 'tab', noCache: false, roles: ['order_summary'], scrollTop: 0 },
      hidden: false
    }
```


3. 离开此页面/路由时，保存当前组件的scrollTop值到路由中

```javascript
router.beforeEach(async(to, from, next) => {
  if (from.meta.noCache === false) {
    const $content = document.querySelector('#' + 'md5_' + md5(from.path))
    const scrollTop = $content ? $content.scrollTop : 0
    from.meta.scrollTop = scrollTop
  }
  
  // 其他代码....
}   
```

4. 对应组件activated方法设置scrollTop

**只有用<keep-alive></keep-alive>包裹的组件才会有activated生命周期**
```javascript

    activated() {
        const scrollTop = this.$route.meta.scrollTop
        const $content = document.querySelector('#md5_' + md5(this.$route.path))
        if (scrollTop && $content) {
        $content.scrollTop = scrollTop
        }
    }

```

备注：其中的md5是为了避免path中的非法id值字符，md5引用与js-md5 
（package.json添加js-md5依赖，引用import md5 from 'js-md5'）


二、组件内部的滚动条

例如companymanage/index组件

```html
<el-table ref="companyTable" ...>
    ...
</el-table>
```



```javascript
  activated() {
    // 激活后重新设置滚动条
    this.saveScroll()
  },
  mounted() {
    // 监听滚动条的位置
    this.$refs.companyTable.bodyWrapper.addEventListener('scroll', (res) => {
      const height = res.target
      this.tableScrollTop = height.scrollTop
    }, false)
  },
  beforeDestroy() {
    this.$refs.companyTable.bodyWrapper.removeEventListener('scroll', (res) => {
      const height = res.target
      this.scrollTop = height.scrollTop
    }, false)
  },
  methods: {
    saveScroll() {
      this.$nextTick(() => {
        setTimeout(() => {
          var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
          scrollTop.scrollTop = this.tableScrollTop
        }, 13)
      })
      // var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
      // scrollTop.scrollTop = this.tableScrollTop
    }
    .....
}
```