---
title: vue元素拖拽与序号编写协同修改排序
comments: true
date: 2021-06-15 11:05:11
categories: 前端
tags: 前端
---

这是我参与更文挑战的第16天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

因运营人员需要排序某个产品列表，这里记录使用SortableJS实现元素排序的过程。

[sortableJs官网](http://www.sortablejs.com/)

## 引入

`package.json`中添加：

```json
"sortablejs": "1.8.4",
```

需要排序的组件上添加：

```javascript
import Sortable from 'sortablejs'
```

## 添加控制标签

在需要添加拖拽效果的控件上添加`id`标签。`vue`环境下为`el-table`增加拖拽排序则需要添加`ref`与`row-key`，代码如下所示：

```html
<el-table
          ref="myDragTable"
          v-loading="loading"
          :data="dataList"
          row-key="id"
          element-loading-text="商品加载中"
          border
          fit
          style="width: 100%;"
          highlight-current-row
        >
    ....
</el-table>
```

其中的关键在于以下两个标签：

```vue
ref="myDragTable"
row-key="id"
```

不要忘记设置`row-key`，否则会发生拖拽后行不规则的移动。

给其中的某列添加拖拽功能标识：

```vue
<el-table-column align="center" label="拖动" width="45" class-name="allow">
    <template>
		<i class="el-icon-rank" />
    </template>
</el-table-column>
```

该列展示效果如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ef96c5c55924a98ab33ff8bf20ae231~tplv-k3u1fbpfcp-watermark.image)

## 辅助数据与排序方法

在vue组件的data中需要添加两个数组来记录拖拽前与拖拽后的顺序：

```javascript
data() {
    return {
        dataList: [...] // 列表展示数据
        oldPList: [], // 排序用
      	newPList: [] // 排序用
    }
}
```

两个排序数组的初始化应该放在什么地方呢？

`setSort`方法又该在什么时间点去执行呢？

应该在获取数据之后与渲染DOM之后，关键代码如下图：

```javascript
methods: {
    getData() {
      api...({ // 请求后端数据
        ...
      }).then(res => {
        // 这里表示已从后端获取了数据
        this.dataList = res.data
        this.oldPList = this.dataList.map(v => v.id)
        this.newPList = this.oldPList.slice()
        this.$nextTick(() => {
          // 表示在渲染dom之后调用setSort方法
          this.setSort()
        })
      })
    },
     setSort() {
      // 获取操作元素
      const el = this.$refs.myDragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        handle: '.allow', // 仅某一列可以拖动，这样不影响其他列的点击，复制功能
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
            /*这里就是在处理拖拽后的重新排序了*/
          // 找到所拖拽的行  
          const targetRow = this.dataList.splice(evt.oldIndex, 1)[0]
          // 操作原数据，重新排列所拖拽行的位置
          this.dataList.splice(evt.newIndex, 0, targetRow)

          // 以下步骤为通过重新排序，将新的排序通过接口告知后端，后端数据重排
          const tempIndex = this.newPList.splice(evt.oldIndex, 1)[0]
          this.newPList.splice(evt.newIndex, 0, tempIndex)
          // 调用接口更新排序
          // updateOrder({ tabsOrder: this.newPList }).then(response => {
          //   this.$message.success('更新排序成功')
          // })
        }
      })
    },
}
```

具体接口配置信息：http://www.sortablejs.com/options.html

## 编写序号排序

拖拽排序适合少量数据的情况，不适合大数据量或者将一个元素从末尾拖到头部。我们还需要可以手动修改序号的方式来辅助。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb3da9308a134a89b111085ea98dd44c~tplv-k3u1fbpfcp-watermark.image)

这样操作人员可以很方便的将某些元素置顶或设置到末尾。

我们需要监听`el-input`的`change`事件，请求后台，更新排序信息。

为什么是监听`change`事件而不是`input`事件呢？因为`input`事件在你的输入框内有任何变动时会立即请求，而`change`则会在你输入完毕后（比如输入完毕点击enter或者鼠标点击空白处等）



