---
title: VUE快速上手
comments: true
abbrlink: f771
date: 2020-04-10 23:28:49
categories:
tags:
---



## 一、vue简介

官方文档： [中文](https://cn.vuejs.org/v2/guide/index.html)， [英文](https://vuejs.org/v2/guide/)

1. 渐进式框架： 核心库专注视图层，便于与第三方与现有项目整合。

2. 简单示例： 看视频[中文](https://cn.vuejs.org/v2/guide/index.html)

3. 结构：数据绑定

   ```html
   <html>
       ...
   	<div id="app">
   	    {{message}}
           <!-- 文本插值 -->
           
   	</div>
       ...
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

   (1) **v-if **条件渲染

   ```html
   <p v-if="seen">现在你看到我了</p>
   ```

   (2) **v-for **循环

   ```html
<li v-for="todo in todos">
     {{ todo.text }}
   </li>
   ```
   
   (3) **v-on**    简写 @

   ```html
	<button v-on:click="reverseMessage">反转消息</button>
    <button @click="reverseMessage">反转消息</button>
   ```
   
   (4) v-model， 表单输入双向绑定
   
	```html
	<input v-model="message">
	```


 ## 二、 Vue组件 [链接](https://cn.vuejs.org/v2/guide/components-registration.html)

1. 模板组成：

   template 展示

   script 数据/方法等

   style 样式

2. 元素：
    (1) name 组件名称
    (2) props 从组件外向组件内传递参数
    (3) data 元素内部的参数：object/array/...
    (4) computed 计算属性
    (5) methods： 组件内的方法
    (6) watch 监听参数
    ...

3. 组件的使用

```html
<todo-item></todo-item>
```

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

## 三、项目上手

在线文档：[vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

github： [vue-elment-admin](https://github.com/PanJiaChen/vue-element-admin)

现有项目的目录结构

```bash
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── plop-templates             # 基本模板
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── icons                  # 项目所有 svg icons
│   ├── lang                   # 国际化 language
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── vendor                 # 公用vendor
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```



[vue-router](https://router.vuejs.org/zh/): 路由/跳转

[axios](http://axios-js.com/) ： http请求

复杂参数传递：

 2. json字符串：

```javascript
    {
   		paraNames: JSON.stringify(object)
    }
```

```java
    String paraNames = getPara("paraNames");
	...
   	// jsonObject解析
    Record productInfo = new Record()
        .setColumns(
        	FastJson.getJson()
        		.parse(productInfoJsonStr, Map.class)
    	);
	... 
    // json中的jsonArray解析
    List<Record> imgList = StrUtil
        .getRecordListFromJsonArray(
        	productInfo.get("imgList")
    	);
```

​    

​	1. 数组参数：

```javascript
{
	const ids = [1,2]
	params: {
		ids: ids
	}
}
```

```java
// 后端
Integer[] ids = getParaValuesToInt("ids[]");
```

跨域问题的解决方案

​	普通接口：

​		测试环境：前台代理

​		正式环境：nginx	(目前单机部署，尚未涉及)

​	文件上传/下载: 已封装，参照管理模块-人员管理下载模板/上传人员

第三方组件的使用——element-ui
	1. 常用布局：el-row/el-col
 	2. 常用组件: el-table/el-dialog

易错点：
​	el-table: 
​		@select与@select-all都需要监听

​		//...

常用CSS:

```css
// 居中
.center { 
  display: flex;
  justify-content: center;
  align-items: center;
}
```



## 四、编码规范

1. 尽量多写可复用的小组件
2. 参数注释要写明：例如一个Object包含哪些字段
3. eslint

题外：推荐编辑器
1. WebStorm
   
   (1) 常用功能：split Vertically/Horizontally 纵向/横向分隔窗口
   
2. HbuilderX
    免费

编程实践
