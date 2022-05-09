---
title: 实现一个VUE文件上传组件-el-upload是个好东西
comments: true
date: 2021-11-03 17:46:49
categories:
tags:
---

这是我参与11月更文挑战的第3天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/)

## 问题起源

因为团队之前没有Web前端，半路出家学了一点点VUE，生产环境魔改了一下花裤衩的vue-element-admin项目。之前系统中的上传一直不怎么好用，代码很凌乱。一碰到文件上传的需求内心总有一丝丝慌慌哒。

最近，小伙伴给我推了一个新的半成品框架：若依。拿过来一看，跟vue-element-ui很相似，相当于一个vue-element-admin+一些基础工具和扩展。特意看了一下其中的文件上传功能，也搭配着半年多于VUE，element-ui的磨合，借着这次更文，总结一下vue-element的文件上传方式。

## 自定义上传方法

在之前我们使用文件上传时，是将文件数据放置在一个form表单中，其中虽然用到了`el-upload`，单只将其用作一个文件获取组件。

实现代码如下：

VUE页面部分：

```vue
<el-upload
          ref="Upload"
          class="upload-demo"
          :headers="uploadHeaders"
          :file-list="files"
          :auto-upload="false"
          :multiple="false"
          action="/xxxx/xxxx"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" class="el-icon-upload" @click="submitUpload">上传</el-button>
        </el-upload>
```

JavaScript部分：

```javascript
submitUpload() {
      // 开始执行上传
      const form = this.$refs['uploadFile'].$el
      const formData = new FormData(form)
      formData.append('welfareId', this.welfareId)
      formData.append('amount', this.amount)
    	// 上传方法
      uploadMethods(formData).then(response => {
        this.$message.success(response.data.msg)
        this.$emit('after-upload')
      })
    }
```

上传方法部分代码：

```javascript
export default function uploadServiceFunction(data) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  config.headers['token'] = 'xxxxx'

  let baseurl = data.url
  if (process.env.NODE_ENV === 'development') {
    baseurl = getBaseUrl() + data.url
  } else {
    baseurl = process.env.VUE_APP_BASE_API + data.url
  }
  return axios.post(baseurl, data.formData, config)
}
```

这种方式**繁琐**，且在上传方法部分代码中，还需要特意区分开发环境与生产环境前缀(见端代码的倒数3-7行)，并且在显示效果上，也看不到上传进度，没有很好的使用上el-upload的显示效果。嗯，那时候真是太菜了！

## el-upload.submit

其实el-upload中已经有很好的配置，包括配置`headers`，配置其他信息字段的`data`字段等。

现在一般这么上传文件：

```vue
<el-upload
           ref="uploadRef"
           class="avatar-uploader"
           :action="uploadUrl"
           :show-file-list="false"
           :on-success="handleAvatarSuccess"
           :before-upload="beforeAvatarUpload"
           :data="qiniuData"
              >
              	<!-- 控件内容 -->
              </el-upload>
```

若非自动上传，则配置手动上传方法这样写：

```javascript
 actionUpload() {
        this.$refs.uploadRef.submit()
      }
```

这样在文件上传时，即可看到`el-upload`封装好的文件实时上传进度与结果。Nice！
