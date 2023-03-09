# Python3 多帧图片拼接成GIF

在[python3如何处理GIF图片](https://juejin.cn/post/7195137959199244345)中，我们介绍了如何通过python的PIL库，使用`Image.open`，`Image.tell`，`Image.save`，`Image.seek`四个函数，将一个GIF拆分成多帧图片的实现方式。本文将介绍如何通过PIL库将多帧图片合成一个GIF图片。

## 预期实现效果

输入的多张图

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b12ee964e1634911bea041c4e5ae613b~tplv-k3u1fbpfcp-watermark.image?)

合成的GIF

![c3.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5ee85021d594bf2bfaab6abf6c26a98~tplv-k3u1fbpfcp-watermark.image?)



![c5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5744c81c6119494fad95c6c471962d61~tplv-k3u1fbpfcp-watermark.image?)

## Pillow库

[Pillow库](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.save)中`Image.save`函数可以保存多帧图片为gif。

其具体格式为：

`Image.save(fp, format=None, **params)`

官方的英文文档就不贴了，翻译过来大概是如下含义

>将此图像保存在给定的文件名下。如果没有指定格式，则使用的格式由文件名扩展名决定。
>
>关键字选项可用于向作者提供额外的说明。如果写入器没有识别到一个选项，它就会被无声地忽略。每个写入器的图像格式文档中都描述了可用的选项。
>
>您可以使用文件对象而不是文件名。在这种情况下，必须始终指定格式。文件对象必须实现seek、tell和write方法，并以二进制模式打开。

## save函数中的**params参数

该参数根据不同的格式有不同的可选项目，具体需要在[文档](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html)中查看，文档中GIF的部分参数如下截图所示。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bb95bc52cef46179971e4c5ba1c29e5~tplv-k3u1fbpfcp-watermark.image?)

## 实现思路

根据文档，我们需要按照一定的次序读取图片，并通过`append_images`参数传递给`Image.save`函数。

## 实现代码

```python
from PIL import Image
import os

def pic2gifV2(dir_name, out_name, duration):
     '''
    dir_name: 存放各个帧的图片目录
    out_name: 输出的文件名
    duration: gif的播放速度
    '''
    path = os.getcwd()
    os.chdir(dir_name)
    dirs = os.listdir()
    images = []
    # 获取图片大小
    firstImage = Image.open(dirs[0])
    for d in dirs:
        images.append(Image.open(d))
    img = Image.new('RGB', (firstImage.width, firstImage.height), (255, 255, 255))
    img.save(path + '/' + out_name + '.gif', save_all=True, append_images=images[1:], duration=duration)
   

pic2gifV2('caixukun/', 'c5', 100)
```

除了使用Pillow库，也可以使用imageio来实现，主要代码如下：

```python
import imageio
import os

def pic2gif(dir_name, out_name, duration):
    path = os.getcwd()
    os.chdir(dir_name)
    dirs = os.listdir()
    images = []
    num = 0
    for d in dirs:
        images.append(imageio.imread(d))
        num += 1
    os.chdir(path)
    imageio.mimsave(out_name + '.gif',images,duration = duration)
```