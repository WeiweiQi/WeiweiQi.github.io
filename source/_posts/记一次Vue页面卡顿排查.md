---
title: 记一次Vue页面卡顿排查
comments: true
date: 2021-06-09 08:05:47
categories: 前端
tags: 前端
---

这是我参与更文挑战的第9天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

开心，T恤到手~

> 策之不以其道，食之不能尽其材，鸣之而不能通其意，执策而临之，曰：“天下无马！”呜呼！其真无马邪？其真不知马也！

运营人员反馈某商品列表页面，每页1000条时，页面卡顿严重，已经影响使用，经实际测试，1000个条记录时，页面加载长达2分钟+，并且会出现卡死情况。遂开始优化之旅~~

## 页面元素

页面主体部分截图如下，每个元素包括一张主图，一些基本的信息字段。运营反馈当设置分页数量为1000时，会出现卡死，经过实际测试，可以重现。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad8055fc62c44e1e8a8c8e1f2c109e9f~tplv-k3u1fbpfcp-watermark.image)

主体前端代码分为两个部分，一个是包裹这些元素的父元素，一个是元素组件：

```vue
<!-- 父元素关键代码 --> 
<div v-loading="productsLoading" class="choosingproduct-products">
     <!-- product-card为子组件，使用v-model绑定列表元素 -->
      <product-card
        v-for="(item, index) in result.list"
        :key="index"
        v-model="result.list[index]"
        :showpoint="false"
      />
      <div style="width: 100%;margin-top: 15px;margin-bottom: 85px" class="center">
        <pagination
          :total="result.totalRow"
          :page.sync="query.pageNum"
          :limit.sync="query.numPerPage"
          @pagination="getSkus"
        />
  	</div>
</div>
```

子组件`ProductCard`的关键代码如下：

```vue
<template>
  <div class="productcard flex-col-start-start" @click="changeChoosed">
    <div class="flex-row-center-spacebetween" style="width: 100%">
       <!-- 关键点1：状态切换使用了visibility -->
      <el-checkbox v-model="value.choosed" class="productcard-checkbox " :class="{'productcard-delete' : !value.choosed}" @change="changeChoosed" />
    </div>
    <div style="width: 100%" class="center">
       <!-- 关键点2: 图片过多 -->
      <el-image :src="value.picurl" style="height: 114px;width: 114px" />
    </div>
    <div .... />
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      product: {
        choosed: false
      }
    }
  },
  watch: {
     // 关键点3： 也是最重要的一点，watch监听不当，导致性能与卡顿
     product: {
       deep: true,
       handler: function(newValue, oldValue) {
        	this.$emit('input', this.product)
   	   }
    },
    value: {
      deep: true,
      handler: function() {
        this.product = this.value
      }
    }
  },
  created() {
    this.product = this.value
  },
  methods: {
    changeChoosed() {
      // 改变选中状态
      this.product.choosed = !this.product.choosed
    }
  }
}
</script>

<style scoped lang="scss">
.productcard {
  .productcard-checkbox {
  	visibility: hidden;
  }

  .productcard-delete {
    visibility: hidden;
  }
}

 .productcard:hover {
   .productcard-checkbox {
   	 visibility: visible;
   }
   .productcard-delete {
    visibility: visible;
   }
 }
</style>

```

## 后端接口

后端根据前端选择的条件，执行查询SQL，返回数据，使用的数据库连接池Druid+ActiveRecord模式。（对这一点感兴趣的可以检索jfinal相关）

```java
public Page<Record> getData() {
		......
		Page<Record> result = Db.paginate(pageNum, numPerPage, select, exceptSelect);
    	for(Record r : result.getList()) {
            display(r);
        }
	    return result;
}
```

## 分析步骤

因为后端的性能更好分析一些，本人也更熟悉后端，所以先从后端入手：

### 后端

经过测试，接口返回1000条数据的时间大约是17秒。

1. 这个时间相当长，有优化空间
2. 前台卡顿时间2分钟不符合，不是前端卡死的问题关键

### 前端

使用Chrome-Performance监听加载1000条数据的性能情况，我们得到如下几张图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd69bb65c1f744bf8f60803b25c60d51~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd377a64168e491894d6a4dba915f151~tplv-k3u1fbpfcp-watermark.image)

从而确定了卡顿问题主要在前端，而且从`renderList`我们猜测，卡顿主要在于`ProductCard`这个组件的渲染上。

## 猜测

定位到了`ProductCard`组件后，我们首先根据Network查看到图片的加载时间较长，猜测可能是图片过多导致加载过长。

第二个，我们注意到选中与不选中，我们在CSS中是通过变换组件的visibility属性来实现的。是否是visibility切换会导致组件渲染卡顿呢？我们检索资料发现`visibility:hidden`的性能实际比`display:none`要好。

第三个（终于找到你！），我们在组件中使用了`watch`，同时监听组件内部元素`product`与`props`中的`value`，当product变动时，会通过`this.$emit('input', this.product)`传递给外部的`value`，而`value`变动，又会触发`this.product = this.value`，进而又导致`product`变动，形成近乎死循环。造成严重性能问题。

我们得到以下结论：

1. 图片过多导致加载过长
2. 使用visibility
3. 慎用`watch`

## 优化

### 后端

我们使用`parallelStream`优化后端性能，优化后代码如下。接口响应时间从17秒左右下降到5秒。

```java
public Page<Record> getData() {
		......
		Page<Record> result = Db.paginate(pageNum, numPerPage, select, exceptSelect);
    	result.getList().parallelStream().forEach(r -> {
			display(r);
		});
	    return result;
}
```

### 前端

针对分析中的三点，我们分别使用图片懒加载和修复`watch`后，页面打卡耗时大约为10秒，且不在出现卡死现象。

优化后的`watch`如下：

```vue
.......
watch: {
    value: {
      deep: true,
      handler: function() {
        this.product = this.value
      }
    }
  },
created() {
   this.product = this.value
},
methods: {
    changeChoosed() {
      this.product.choosed = !this.product.choosed
	  // 向上层发送数据
      this.$emit('input', this.product)
    }
......
}
```



对于前端没有优化经验，欢迎大佬指正！

若不吝可点个赞！
