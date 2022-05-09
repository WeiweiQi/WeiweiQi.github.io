---
title: 如何使用vue的transition做动画效果
comments: true
date: 2021-08-17 15:59:11
categories:
tags:
---

这是我参与8月更文挑战的第17天，活动详情查看：[8月更文挑战](https://juejin.cn/post/6987962113788493831)

## 问题起源

问题起源于在生产环境要做一个轮播图，之前我们在文章：[纯CSS实现轮播图](https://juejin.cn/post/6993224617393389581) 以及文章：[无框架从零实现一个轮播图 | 8月更文挑战](https://juejin.cn/post/6992137880747376647)介绍了两种生成轮播图的方式，偶然发现VUE中有一个动画功能：[进入/离开&列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)，其中有个功能与我们想要的轮播效果很相似。下图取自[进入/离开&列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)官网第一个例子，效果图如下：

![8ea1eccf-4ac1-463f-bd11-582aac51c558.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb062ea4d1684043a6ad748172d3bf83~tplv-k3u1fbpfcp-watermark.image)

这跟我们想要的轮播图切换效果很相似。

由此开启我们的学习之路，出发~~



## `<transition>`的基本用法

官网给出的例子解释说，`<transition>`支持以下4种“进入/离开”，包括：

> - 条件渲染 (使用 `v-if`)
> - 条件展示 (使用 `v-show`)
> - 动态组件
> - 组件根节点

例如：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <title>Document</title>
    </head>

    <body>
        <div id="components-demo">
            <button v-on:click="show = !show">
                Toggle
            </button>
            <transition name="fade">
                <p v-if="show">hello</p>
            </transition>
        </div>
    </body>

    <script>

        new Vue({
            el: '#components-demo',
            data: {
                abb: 'abc',
                show: false
            },
            methods: {
                
            }
        });


    </script>
    <style>
        .fade-enter-active, .fade-leave-active {
            transition: opacity 2s;
        } 
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }
    </style>

</html>

```

这个官网示例简单的说明了如何使用`<transition>`。

并且通过官网解释的动画原理可以看出，其基本原理是通过动态绑定CSS实现动画效果的。

那么问题来了，能够通过`<transition>`实现轮播图呢？根据含义猜测这应该是VUE中“[列表过渡](https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E8%BF%87%E6%B8%A1)”部分的知识，我们来尝试一下

## 使用`<transition-group>`实现轮播图

vue的`<transition>`只能使用单一组件而不支持列表过渡，列表过渡需要使用`<transition-group>`，完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <title>Document</title>
    </head>

    <body>
        <div id="app">
            <button @click="activeIndex++">btton</button>
            <transition-group name="list" tag="div" style="overflow: hidden;height: 40px;border: 1px solid black;" class="center">
                <div v-for="index in list" :key="index" v-show="activeIndex === index" style="border: 1px solid black;margin: 0;padding:0;background: lightblue;">
                    {{index}}
                </div>
            </transition-group>
        </div>
    </body>

    <script>

        new Vue({
            el: '#app',
            data: {
                abb: 'abc',
                show: false,
                list: [
                    1,2,3,4,5
                ],
                activeIndex: 1
            },
            methods: {
                
            }
        });


    </script>
    <style>
        .list-enter-to {
            transition: all 1s ease;
            transform: translateY(0);
        }

        /*上一个元素消失的动画*/
        .list-leave-active {
            transition: all 1s ease;
            transform: translateY(-40px);
            
        }
        
        /*下一个元素进入的动画效果*/
        .list-enter {
            transform: translateY(100%);
        }

        .list-leave {
            transform: translateY(0);
        }

        .center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

    </style>

</html>

```

动画效果：

![60aabd5d-869c-4ce9-8d4f-483c50c06ae7.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/344ea6504c2e468997dace52a3f12cda~tplv-k3u1fbpfcp-watermark.image)



很奇怪的一点是，最后元素总要抖动一下。暂未查明原因。

