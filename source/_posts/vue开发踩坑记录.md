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

遇到的实际情况是，el-table中的el-image在不设置width/height的情况下，需要重新刷新页面才会展示el-table的侧边滚动条。遗憾的是在单独element-ui的环境下，并没有成功复现这个bug，所以具体原因还不清楚。

解决方案是给el-image设置width/height。

```vue
<el-table-column label="图片" width="85" fixed="left" align="center">
  <template 2. -scope="scope">
    <div class="my-el-row">
      <el-image :src="scope.row.picurl" style="width: 4vw;height: 4vw;" />
    </div>
  </template>
</el-table-column>
```



#### 2. axio提交数据后刷新数据不是最新的

提交数据后想要看到最新的数据，需要将“刷新函数”写在 .then(reponse => { '执行刷新' })， 若是在外侧，在axio请求成功之前，函数照样执行，不能保证刷新到最新数据



#### 3. vue 项目传参：

（1） 一般直接使用json格式传递即可：{参数名 ： 参数值}

（2） 复杂参数，例如列表，使用 {参数名： JSON.stringify(参数值)}，然后后台再进行json解析



#### 4. 使用SortableJS对el-table进行排序时容易遗漏row-key



5. 