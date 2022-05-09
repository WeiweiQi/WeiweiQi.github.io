---
title: CSS控制input在弹出输入提示时不变色
comments: true
date: 2021-08-11 18:45:10
categories:
tags:
---

这是我参与8月更文挑战的第11天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)



## 问题起源

最近在做的一个网站的登录页面，本来设计好好的，时间测试的时候却发现了一个比较严重的问题。

如下图所示，因为Chrome的用户名与密码输入提示，导致输入框变了颜色。与设计颜色完全不一样了。怎么办呢？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60398ca146f049d990bf929b56d25df6~tplv-k3u1fbpfcp-watermark.image)



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9d31f9fb3a5414e9da3b96a34d2a761~tplv-k3u1fbpfcp-watermark.image)

## 方案查找

不知道怎么解决，先去搜索吧~

以关键字“input 关闭输入提示”进行搜索，查找到一些解决方案。

一些相关文章：

1. [关于浏览器自动展示用户名、密码等输入框的解决办法](https://www.cnblogs.com/cjyboy/p/7718373.html)
2. [点击密码input框禁止浏览器弹出已经记录的账号密码](https://blog.csdn.net/qq_44706619/article/details/114062961)

文章中提出了多种实现方式，其中包括：

1. `autocomplete="off"`，尝试了一下，无效，仍然变色
2. 使用js在加载或者onload时进行重置操作，未尝试，将问题复杂化了
3. 使用`<form>`标签和`<input type=”password”/>`来兼容Chrome与Safari，仍然太复杂，不好不好

最后，在我学习的项目`vue-element-admin`中找到了一种比较好的纯CSS的解决方案。

其中的几个自己不会用，不常用的关键点

### 关键点1：cater-color

cater-color：定义**插入光标**（caret）的颜色

文档链接：https://developer.mozilla.org/zh-CN/docs/Web/CSS/caret-color

### 关键点2：@supports

@supports: 指定依赖于浏览器中的一个或多个特定的CSS功能的支持声明

文档链接：https://developer.mozilla.org/zh-CN/docs/Web/CSS/@supports


## 方案选择



最终的实现代码：代码主要来源与修改花裤衩vue-element-admin项目中的登录页。

```css
<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#fff;
  $light_gray:#fff;
  $cursor: #999999;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .el-input {
    display: inline-block;
    width: 100%;
    border-radius: 6px;

    input {
      background: transparent;
      border: 1px solid #E5E5E5;;
      -webkit-appearance: none;
      border-radius: 6px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    input:focus {
      border-color: #555555;
    }
  }
</style>
```



