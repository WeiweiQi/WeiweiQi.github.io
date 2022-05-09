---
title: 用python爬取网络图——简单便捷
comments: true
date: 2021-06-10 08:14:35
categories:
tags:
---

这是我参与更文挑战的第10天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

> 是以圣人居无为之事，行不言之教，万物作而弗始也，为而弗志也，成功而弗居也。夫唯弗居，是以弗去。

经常有需求说需要爬取某某网站的某些数据，因为python的包最多的，首先尝试使用python爬~便有了下文~

有了python爬虫，爬图这项技能，不光能爬数据，爬图~

建议大家在法律范围内做爬虫，毕竟命令是领导下的，锅却要我们来背~

## python基本配置

### 安装pip

通过pip我们可以很方便的通过包名安装其他的python包。在Python 2 >=2.7.9 or Python 3 >=3.4 中已经内置了pip。可以使用如下命令查看是否已安装pip。

```python
python -m pip --version
# output: pip 18.0 from C:\Users\lenovo\AppData\Local\Programs\Python\Python36\lib\site-packages\pip (python 3.6)
```

如果没有，可以通过下载[get-pip.py](https://bootstrap.pypa.io/get-pip.py)，并运行如下命令安装：

```python
python get-pip.py
```

我们可以使用pip安装其他包，如下文需要使用的`BeautifulSoup`需要我们安装`bs4`

```python
pip3 install bs4
```

## 爬虫常用包

### requests

`requests`是一个处理URL资源很方便的包。

```python
import requests

r = requests.get('https://juejin.cn')
print(r)
print(r.status_code)
print(r.text)
```

输出结果：

```python
<Response [200]>
200
<!doctype html>
<html data-n-head-ssr lang="zh" data-n-head="%7B%22lang%22:%7B%22ssr%22:%22zh%22%7D%7D">
  <head >
    <title>掘金 - 代码不止，掘金不停</title><meta data-n-head="ssr" charset="utf-8"><meta data-n-head="ssr" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"><meta data-n-head="ssr" name="apple-itu......
```

`requests`我们可以在请求中添加头部，以及需要验证网站的cookie信息。详细文档可查看：[Requests: HTTP for Humans](https://docs.python-requests.org/en/latest/)

几个常用的样例：

```python
r = requests.get('https://xxx', auth=('user', 'pass'))
r = requests.post('https://xxxx', data = {'key':'value'})
payload = {'key1': 'value1', 'key2': 'value2'}
r = requests.get('https://httpbin.org/get', params=payload)
print(r.text)
```

### BeautifulSoup

使用Beautiful Soup可以很方便的从html中提取数据。

官方中文文档地址：https://beautifulsoup.readthedocs.io/zh_CN/v4.4.0/

简单的使用样例：

```python
from bs4 import BeautifulSoup
soup = BeautifulSoup(open("index.html"))
soup = BeautifulSoup("<html>data</html>")

# 浏览数据的方式
soup.title
# <title>The Dormouse's story</title>
soup.title.name
# u'title'
soup.title.string
# u'The Dormouse's story'
soup.title.parent.name
# u'head'
soup.p
# <p class="title"><b>The Dormouse's story</b></p>
soup.p['class']
# u'title'
soup.a
# <a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>
soup.find_all('a')
# [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
#  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
#  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
soup.find(id="link3")
# <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>
```

### open函数文件下载

open是python的内置函数，用于打开一个文件，并返回文件对象。常用参数为`file`与`mode`，完整参数如下：

```python
open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)
"""
参数说明:
file: 必需，文件路径（相对或者绝对路径）。
mode: 可选，文件打开模式:
buffering: 设置缓冲
encoding: 一般使用utf8
errors: 报错级别
newline: 区分换行符
closefd: 传入的file参数类型
opener:
"""
```

## 开启爬图之路

爬图链接：https://www.easyapi.com/xxx

这个链接的特点是：

1. 简单，只有一张图片
2. 链接不变，但刷新后图片变化

网页HTML代码与页面展示如图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/233d9a233d7c4ae3bde3d98b948acd28~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6033874c28524f9e86471a6529426f0b~tplv-k3u1fbpfcp-watermark.image)

我们取其中的重要源码查看：

```html
<head>
   ...
</head>
<body id="404">
<div class="mheight wp">
    <div class="con_nofound">
        <div>
            <!-- 重点在于如何获取这个img标签以及src内容 -->
            <p><img src="https://qiniu.easyapi.com/photo/girl106.jpg" title="欣赏美女" width="600"></p>
        </div>
    </div>
</div>
....
</body>
```

刷新页面，会发现`img`的`src`路径在编号，但`title`不变。

因此，我们可以通过`<img title="欣赏美女" .../>`来获取这个标签以及`src`

### 获取html内容

使用requests获取html内容：

```python
headers = {'referer': 'https://www.easyapi.com/highmall/service', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'}
htmltxt = requests.get(res_url, headers=headers).text
```

### 查找html中的图片链接

```python
html = BeautifulSoup(htmltxt)
    for link in html.find_all('img', {'title': '欣赏美女'}):
        # print(link.get('src'))
        srcLink = link.get('src')
```

### 下载图片

```python
# 'wb'表示以二进制格式打开一个文件只用于写入。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。一般用于非文本文件如图片等。
with open('./pic/' + os.path.basename(srcLink), 'wb') as file:
     file.write(requests.get(srcLink).content)
```

## 完整代码

网页图片是随机的，因此我们循环请求1000次，获取并下载图片。完整代码：

```python
import requests
from bs4 import BeautifulSoup
import os

index = 0
headers = {'referer': 'https://www.easyapi.com/xxx/service', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'}

# 保存图片
def save_jpg(res_url):
    global index
    html = BeautifulSoup(requests.get(res_url, headers=headers).text)
    for link in html.find_all('img', {'title': '欣赏美女'}):
        print('./pic/' + os.path.basename(link.get('src')))
        with open('./pic/' + os.path.basename(link.get('src')), 'wb') as jpg:
            jpg.write(requests.get(link.get('src')).content)
        print("正在抓取第"+str(index)+"条数据")
        index += 1

if __name__ == '__main__':
    url = 'https://www.easyapi.com/xxx/service'
    # 其实不需要循环到1000，通过打印链接可以发现，图片名称地址为 xxx/girl(number).jpg，优化方向可以舍弃获取html再获取图片链接
    for i in range(0, 1000):
        save_jpg(url)

```

运行效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d971bee684f4f98b66f47ca5af43dcd~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a702ea06ca56491b907bd1c5de7f84a1~tplv-k3u1fbpfcp-watermark.image)



有了这项技能，你不光能爬图片~~

若不吝，请点个赞！

