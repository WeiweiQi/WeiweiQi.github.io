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



#### 5. textarea参数使用GET方法传递给后台会丢失换行符，应该使用POST方法

（这一点应该不属于vue）



#### 6.  同router.path的情况下组件复用的问题：

统一处理方法是，tagview不可复用，每次添加新的tagview时，移除相同path的其他view，避免后续编程人员因为忘记监听query/params变化导致错误



#### 7. 常用组件易错点：

1. el-table的Event： select与select-all都需要处理



#### 8. 执行后运行接口问题：

检查portfinder包的版本

检查环境变量是佛有port-*之类的变量



#### 9. Header参数编码问题

因为系统内部分参数，如username是中文，而采用http-header中存储，而http-header只支持英文字符，因此在需要判断header参数时，应将参数写在body中。例如接口中判断登录人时，应前台body写：{username: this.$store.username}



#### 10. el-popover手动关闭问题

el-table-column添加了 fixed="left" 或 fixed="right"后，el-popover无法使用id进行关闭



#### 11. 页面缓存

要保证路由中的name与组件的name一致

```javascript
  {
      path: '....',
      component: () => import('@/views/..../...'),
      name: 'ThisNameMustBeSame',
      meta: { title: '...', icon: 'tab', noCache: false, roles: ['...'] }
    }
```

```javascript
  export default {
    name: 'ThisNameMustBeSame'
  }
```

#### 12.  elment-ui走马灯总有滚动条的问题 el-carousel滚动条问题

    需要设置height值
    
    ```html
    <el-carousel height="100px" >
    ```


#### 13. el-input的change事件与input事件的区别

    change事件仅“仅在输入框失去焦点或用户按下回车时触发”
    
    input事件是“在 Input 值改变时触发”

#### 14.  JS中的计算问题

    和java一样，js中涉及到数值计算，要用bigNumber

#### 15.  时间格式问题

​    

#### 16.  常用数组操作

    注意区分slice与splice
    
    https://www.cnblogs.com/tu-0718/p/10396545.html
    
    　**slice()定义：**从已有的数组中返回你选择的某段数组元素
    
    　**slice()语法：**arrayObject.slice(start,end)
    
    　**①：**start表示从何处开始选取，end表示从何处开始结束选取，表示一个选取的范围
    
    　**②：**start可以为负数，此时它规定从数组尾部开始算起的位置。也就是-1 ，指最后一个元素，-2 指倒数第二个元素，以此类推
    
    　**③：**end如果没有被指定参数，数组会包含从 start 到最后一个数组元素的所有元素
    
    　**④：**slice()方法不会修改数组本身，而是返回所选取范围的数组元素。如果想删除数组中的某一个元素，需要使用splice()
    
    　**splice()**
    
    　**splice()定义：**从数组中添加或删除元素，然后返回被删除的数组元素。
    
    　**splice()语法：**arrayObject.splice(index,howmany,item1,.....,itemX)
    
    　**①：**index表示从什么位置开始添加或删除数组元素
    
    　**②：**howmany表示删除的元素数量，如果为0，则表示不删除数组元素
    
    　**③：i**tem1,.....,itemX表示新增的数组元素
    
    　**④：**splice()方法会改变原始数组

#### 17.  element-ui table合并单元格问题

    函数返回值表达的不同含义
    
    ```javascript
    // 舍弃该单元格
    {
    	rowspan: 0,
    	colspan: 0
    }
    
    // 保留，不跨单元格
    {
    	rowspan: 1,
    	colspan: 1
    }
    
    // a > 1, b > 1时，跨单元格
    {
    	rowspan: a,
    	colspan: b
    }
    ```


​    

#### 18. 下载文件乱码问题

    iconv-lite可解决axios下载文件名中文乱码问题，关键代码: 
    
    ```js
    const iconv = require('iconv-lite') 
    fileName = iconv.decode(fileName, 'UTF-8')
    ```

#### 19. vue-element-admin中刷新当前tagview

    ```javascript
    import store from '@/store'
    
    export function refreshView(thisobj) {
      // In order to make the cached page re-rendered
      store.dispatch('tagsView/delAllCachedViews', thisobj.$route)
      const { fullPath } = thisobj.$route
      thisobj.$router.replace({
        path: '/redirect' + fullPath
      })
    }
    
    // 调用
    refreshView(this)
    ```


​    

#### 20. Promise.prototype.finally()方法

    ```javascript
    apiMethod({
        data...
    }).then(response => {
        // 请求成功执行的代码
    }).finally(() => {
        // 不管请求失败成功与否, 总是执行
        // 此处可以放置类似loading = false之类的代码
    })
    ```


​    

#### 21. 使用VSCODE编辑支持eslint的项目时报错

VScode默认使用jshint，需要配置关闭jshint。
```json
"jshint.enable": "false"
```

#### 22. TODO