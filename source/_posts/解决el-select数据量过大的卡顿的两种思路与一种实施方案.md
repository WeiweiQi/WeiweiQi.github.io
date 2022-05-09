---
title: 解决el-select数据量过大的卡顿的两种思路与一种实施方案
comments: true
date: 2022-05-06 10:08:27
categories:
tags:
---
经典问题：**在测试环境好好的，怎么到正式环境就不行了？**

——数据量变了。

## 问题来源

最近在开发公司的后台管理系统，很简单的一个部分，给部门设置领导，前端选用Element-UI的 `el-select`组件，后端返回的可选人员列表为当前操作人有权控制的每一个人。

 在测试环境运行好好的，怎么到了正式环境就不行了呢？

## 问题分析

出问题的原始代码很简单：

```html
<el-select
v-model="orgForm.leader"
placeholder="请选择部门领导"
style="width: 15vw"
clearable
  multiple
  filterable
>
  <el-option
v-for="(l, index) in leaderOptions"
:key="index"
:label="l.realname"
:value="l.id"
/>
</el-select>
```

问题出在测试环境时，el-select的可选数据 `leaderOptions`的量级顶多100多人，而到了正式生产环境中，`leaderOptions`达到了将近两万左右，从而造成了组件卡顿。

因此，解决问题的方式就是，如何降低el-select的可选项 `leaderOptions`的数量。

## 两种解决思路

我们认为有两种解决思路：

### 前后端配合

这种方式的优点是，思路清晰简单，修改后台接口的返回数据量，每次查询只返回100条数据，毕竟从使用上来说，不会真的有人一直下拉来选择。

这种方式的缺点是，出现问题的是前端，却需要后端来解决，增加了后端的工作量，或者说，将一个领域的问题扩展到另一个领域的人员去解决，会增加团队沟通成本。

因此，我们放弃了这种方式。（其实就是懒得沟通，就想自己解决问题，不麻烦别人！）

### 纯前端解决

为了减少 `el-select`的可选项数量，我们构造数据：`leaderOptionsTop30`, 每次只返回所有可选项的（大约）30条数据，那么这大约30条数据是根据什么来筛选获的呢？

我们设置el-select的 `filter-method`:

```html
<el-select
              v-model="orgForm.leader"
              placeholder="请选择部门领导"
              style="width: 15vw"
              clearable
              multiple
              filterable
              :filter-method="filterCheckPerOptions"
            >
              <el-option
                v-for="(l, index) in leaderOptionsTop30"
                :key="index"
                :label="l.realname"
                :value="l.id"
              />
            </el-select>
```

方法体：

```javascript
filterCheckPerOptions(query = '') {
    // query是输入框中的检索条件
  var arr = this.leaderOptions.filter(item => {
    return !this.$method.isEmpty(item.realname) && item.realname.includes(query)
  })
  // 根据检索条件筛选出来的选项，只取前30条
  if (arr.length > 30) {
    arr = arr.slice(0, 30)
  }
  // 清空之前的选项
  this.leaderOptionsTop30.splice(0, this.leaderOptionsTop30.length)
  // chosen表示已被选择的选项，添加这一部分主要是为了回显，避免选择框中直接出现用户id
  const chosen = this.getChosenItemsArr()
  // 检索项 + 已选项的并集
  const result = [...arr, ...chosen.filter(item => !arr.includes(item))]
  if (arr.length > 30) {
    this.leaderOptionsTop30.push(...result)
  } else {
    this.leaderOptionsTop30.push(...result)
  }
},
getChosenItemsArr() {
      // 获取已被选中的人员
      const items = []
      for (let i = 0; i < this.leaderOptions.length; i++) {
        if (this.orgForm.leader.indexOf(this.leaderOptions[i].id) >= 0 &&
        items.indexOf(this.leaderOptions[i]) < 0) {
          items.push(this.leaderOptions[i])
        }
      }
      return items
    },
```

打完，收工！

## 题外话

正式环境运行与测试环境运行结果不同，通常有很多原因，例如：

1. 服务器：如服务器的时区，语言等配置不同，可能导致某些未指定特定语言或时区的代码在执行时出现不一致的情况。
2. 数据配置：大多数功能上线后都需要进行后台的数据配置，这一点相信无须多言。
3. 数据量：
   数据量会影响接口的响应速度，页面组件的响应速度等等。比如某个操作需要等待后台接口，而后台接口如果超过一定时长后，前端用户就会明显的感觉操作的卡顿与无响应。
