---
title: vue开发踩坑记录
comments: true
abbrlink: '2e59'
date: 2020-04-03 10:43:08
categories:
tags:
---







#### 1. el-table 嵌套 el-image 导致侧边栏滚动条失效

网络上有说是因为[el-table内容溢出](https://blog.csdn.net/dg_zing/article/details/87191772)导致的，也可能是[el-image中的clickHandler覆盖body的overflow属性](https://juejin.im/post/5e54d18a51882549522abe76#comment)导致的。

遇到的实际情况是，el-table中的el-image在不设置width/height的情况下，需要重新刷新页面才会展示el-table的侧边滚动条。目前的解决方案是给el-image设置width/height。

```vue
<el-table-column label="图片" width="85" fixed="left" align="center">
  <template slot-scope="scope">
    <div class="my-el-row">
      <el-image :src="scope.row.picurl" style="width: 4vw;height: 4vw;" />
    </div>
  </template>
</el-table-column>
```



