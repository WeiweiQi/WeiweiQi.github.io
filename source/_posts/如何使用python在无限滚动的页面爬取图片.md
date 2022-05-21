---
title: 如何使用python在无限滚动的页面爬取图片
comments: true
date: 2022-05-21 15:17:20
categories:
tags:
---

## 无限滚动的逻辑原理

无限滚动的逻辑原理主要是，通过滚动的高度来判断是否到达了底部，如果到达了底部，那么就可以继续滚动，否则就不滚动。

“滚动”时，通过判断上一页查看的最后一条记录的ID，通过最后一条记录ID来获取新的一页的数据，从而实现无限滚动的分页。

我们以微博为例，微博的滚动逻辑是这样的：

1. 初始化时，获取第一页的数据，并保存到本地。

完整的请求链接是：https://weibo.com/ajax/statuses/mymblog?uid=微博用户的ID&page=1&feature=0，

加入请求的数据最后一条ID=1024

2. 滑动到了当前数据底部，就可以继续请求数据并滚动了：

则第二次完整的请求链接为：https://weibo.com/ajax/statuses/mymblog?uid=微博用户的ID&page=2&feature=0&since_id1024

这里我并不清楚其中的feature含义是什么，我们也并不关心。

知道了无限滚动的实现原理，我们就可以想办法来模拟滚动，从而实现完整数据的下载了。

## 如何使用Python下载图片

首先，我们来看看，如何使用Python根据一个图片的网上链接下载图片。


```python
import requests
import requests
import os

# 图片地址
imgUrl = 'https://wx2.sinaimg.cn/large/005yvl0gly1guqphioirnj60x21ml7hm02.jpg'
# 图片保存路径
path = 'D:\\xxx\\xxxx\\xxx'
img = path + '\\' + os.path.basename(imgUrl)
try:
    if not os.path.exists(path):
        #makedirs递归生成多级目录，mkdir仅能生成一级目录
        os.makedirs(path)
    else:
        r = requests.get(imgUrl)
        with open(img, 'wb') as f:
            f.write(r.content)
except:
    print('下载失败')
```

## 模拟Http请求

基于无限滚动的方式就需要我们自己来模拟接口请求，并处理返回的数据。

注意，需要请求时需要携带Cookies，否则一般情况下会被网站拒绝。

```python
import requests

cookie = '个人cookies'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36', 'Cookie': cookie}

url = '请求地址'
data = requests.get(url, headers=headers)
print(data.content)
```

## 解析数据

多数情况下返回的数据为json字符串，在python中，请求的数据格式大多数为bytes，所以需要解码成字符串，然后转换成json格式。

即bytes -> str -> json

```python
import json
import requests

url = '请求地址'
data = requests.get(url, headers=headers)
# bytes 转 str
content = str(data.content, encoding='utf-8')
# str 转 json
json_data = json.loads(content)
# json的数据获取方式
print(json_data['data'])
# json的数据遍历方式
for key, v in pic_infos.items():
    print(key)
    print(v)
```


## 完整的爬虫示例


```python
import requests
import json
import os

## 微博用户的ID
uid = '微博用户的ID'
downloadPath = 'D:\\xxx\\xxx'
cookie = '你的cookie'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36', 'Cookie': cookie}


def downloadPic(url, path):
    img = path + '\\' + os.path.basename(url)
    try:
        if not os.path.exists(path):
            # makedirs递归生成多级目录，mkdir仅能生成一级目录
            os.makedirs(path)
        else:
            r = requests.get(url)
            with open(img, 'wb') as f:
                f.write(r.content)
    except:
        print('下载失败')




# 标识滚动到了底部，也可以通过设置最大页数来控制
notEnd = True
page = 1 # 初始页数
since_id = '' # 初始since_id
while notEnd:
    print('当前页数：', page)
    url = 'https://weibo.com/ajax/statuses/mymblog?uid=' + uid+ '&feature=0&since_id=' + since_id +'&page=' + str(page)
    data = requests.get(url, headers=headers)
    content = str(data.content, encoding='utf-8')
    c = json.loads(content)
    list = c['data']['list']
    last_item = ''
    if len(list) > 0:
        # 未到底部，还可以翻页
        # picUrls = []
        for item in list:
            last_item = item
            nickname = item['user']['screen_name']
            for key, value in item.items():
                if key == 'pic_infos':
                    pic_infos = value
                    for pic_infoKey, pic_info in pic_infos.items():
                        pic = pic_info['original']
                        # 下载路径文件夹名称为微博用户昵称
                        downloadPic(pic['url'], path=downloadPath + '\\' + nickname)
        page = page + 1
        since_id = str(last_item['id']) + 'kp' + str(page)
```

在实际运行过程中，发现除了对应用户外，还会下载一些其他内容，比如他点赞的一些微博也会在其中出现。可以不用管他，也可以通过判断用户id将其过滤掉。

## 最后

本文仅做技术讨论，仅支持获取公开数据，遵守中国法律法规！

爬虫有风险，爬取需谨慎！如违规，请自行承担，别找我啊！



