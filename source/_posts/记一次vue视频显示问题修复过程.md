---
title: 记一次vue视频显示问题修复过程
comments: true
date: 2022-08-22 14:36:04
categories:
tags:
---



## 问题

最近客户反馈，管理系统视频上传预览存在问题，问题概览图如下：



![image-20220822143847514](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220822143847514.png)

据客户反馈，视频并不大，只有5M左右，格式也是常见的mp4格式。我们也在生产环境重现了这一问题。

客户没有问题，大概就是程序的问题。

## 组件概述

视频显示使用的是**vue-video-player**插件，

npm地址：https://www.npmjs.com/package/vue-video-player

Github地址：https://github.com/surmon-china/videojs-player （发现目前最新版只支持Vue3了）

## 使用情况

经过查找，找到了本地使用该组件的代码：

```vue
<video-player
            ref="videoPlayer"
            class="video-player-box"
            :options="item"
            :playsinline="true"
            custom-event-name="customstatechangedeventname"
          />

<script>
    this.videos[i] = {
                height: 178,
                width: 200,
                muted: true,
                language: 'ch',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                  type: 'video/*',
                  src: videourl
                }],
                poster: 'http://xxxxxx'
              }
</script>

```

定位到一行特殊的代码：或许是配置项的type错误。

```javascript
sources: [
    {
        type: 'video/*',
        src: '视频地址'
    }
]
```

根据vue-video-player的描述，type可以设置为`video/mp4`, `video/ogg`, `video/webm`，或许设置为`video/*`不可以。

我们尝试将其修改为`video/mp4`：

![image-20220822161602870](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220822161602870.png)

成功。

## 优化

这里是写死了`type`为`video/mp4`，后续可以写一个方法，根据视频链接后缀名获取`type`值，比如函数名为`getVideoTypeFromSuffix`。



