---
title: VUE快速上手
comments: true
date: 2020-04-10 23:28:49
categories:
tags:
---



Vue.js



## 一、vue简介

官方文档： [中文](https://cn.vuejs.org/v2/guide/index.html)， [英文](https://vuejs.org/v2/guide/)

1. 渐进式框架： 核心库专注视图层，便于与第三方与现有项目整合。

2. 简单示例：看视频

3. 代码结构

   ```html
   <html>
   	<div id="app">
   	    {{message}}
   	</div>
   </html>
   
   <script>
   	var app =new Vue({
           el: '#app',
           data: {
               message: 'abc'
           }
       })
   </script>
   
   <style>
       .class-style {
           color: red
       }
   </style>
   ```

4. 常用指令：

   (1) **v-if**

   ```html
   <p v-if="seen">现在你看到我了</p>
   ```

   

   (2) **v-for**

   ```html
   <li v-for="todo in todos">
     {{ todo.text }}
   </li>
   ```

   

   (3) **v-on**    简写 @

   ```html
   `<button v-on:click="reverseMessage">反转消息</button>`
   `<button @click="reverseMessage">反转消息</button>
   ```

   (4) **v-model**， 表单输入双向绑定

   ```html
   <input v-model="message">
   ```

   

 ## 二、 Vue组件

1. 元素：template/script/style

2. script中的元素：
	(1) name 组件名称
	(2) props 从组件外向组件内传递参数
	(3) data 元素内部的参数：object/array/...
	(4) computed: 计算属性
	(6) watch： 监听
	(5) methods： 组件内的方法
	
3. 组件的使用

4. 组件生命周期

   ![VUE组件的生命周期](https://cn.vuejs.org/images/lifecycle.png)

5. 页面元素的获取方式： refs
```html
<template>
	<div ref="my-div-ref" id="my-div-id"></div>
</template>
<script>
	var dom = this.$refs.my-div-ref
	// 等价于
	var dom = document.getElmentById('my-div-id')
</script>
```



组件间的数据传递

1. 父组件 -> 子组件： props

   ```html
   // 子组件
   <script>
   	export default {
   		name: 'abc',
   		props: {
   			product: {
   				type: Object,
   				default() {
   					return {
   						id: null,
   						name: '无'
   					}
   				}
   			}
   		}
   	}
   </script>
   
   // 父组件
   <template>
   	<abc :product="product"></abc>
   </template>
   <script>
   	export default {
   		name: 'abc',
   		data() {
   			return {
   				product: {
   					id: 2,
   					name: '商品名'
   				}
   			}
   		}
   	}
   </script>
   ```

2. 子组件 -> 父组件： 
   1. v-model/value 

   2. this.$emit(‘$event’, params)： 

      ​	单参（推荐）

      ​	多参(arguments) 例子 Tabs.vue



二、项目上手

现有项目的目录结构



vue-router

axios



跨域问题的解决方案

文件上传/下载

第三方组件的使用——element-ui

	1. 布局
 	2. 



常用HTML

常用CSS



三、编码规范

1. 尽量多写可复用的小组件
2. 参数注释要写明：例如一个Object包含哪些字段
3. 先设计，后编码，先整体，再细节
4. 



题外：推荐编辑器

1. WebStorm

   (1) split Vertically/Horizontally 纵向/横向分隔窗口

2. HbuilderX





编程实践

