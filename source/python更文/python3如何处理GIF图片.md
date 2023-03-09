# python3如何处理GIF图片



## 最终的实现效果

先来看看我们要实现什么效果：

原图：

<div align='center'><image src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f01fc76ebed4207a3c7d802378a9f6a~tplv-k3u1fbpfcp-watermark.image?'></div>

处理后：

非灰度的

<div align='center'><image src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b109e0c998564466a50133eb34fed66b~tplv-k3u1fbpfcp-watermark.image?'></div>

灰度的

<div align='center'><image src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cecbdbd045274549976916f2c32dacda~tplv-k3u1fbpfcp-watermark.image?'></div>



## 实现思路

理解这一思路需要稍有些图像处理基础。gif实际上是多帧图片按照一定的播放速度逐帧播放，又由于视觉停留的生理现象，所以才“动”起来。

基于GIF这一思路，因此若想要实现上述效果，大致思路为：**拆帧-处理-合帧**。具体描述为：

1. 获取GIF的各个帧的图片
2. 逐个处理各个帧的图片，如把各个帧的图片处理成灰度字符图
3. 将步骤2处理后的各帧图片，按照原始次序，再合并为新GIF并输出。

今天我们主要介绍一下第一步，即，如何获取到GIF的各个帧。

## 涉及的主要库

Python的Image库：[Pillow](https://pillow.readthedocs.io/en/stable/reference/Image.html)

可以[链接](https://pillow.readthedocs.io/en/stable/reference/Image.html)查看其各个模块的详细使用文档，如下文使用的`Image.open`，`Image.tell`，`Image.save`，`Image.seek`。

## 主要代码

### 获取各个帧

```python
import os
from PIL import Image

def gif2pic(file, childrenDir, childrenPicName):
    '''
    file: gif 文件
    childrenDir: 各个帧的图片输出子文件夹路径，需要带‘/’
    childrenPicName: 各个帧的图片名称前缀
    '''
    # 获取图片
    im = Image.open(file)
    path = os.getcwd()

    # 创建存放各个帧图片的路径
    if(not os.path.exists(path+childrenDir)):
        os.mkdir(path+childrenDir)
    os.chdir(path+childrenDir)
    # 清空 tmp 目录下内容
    for f in os.listdir(path+childrenDir):
        os.remove(f)
    try:
        while 1:
            # 帧号
            current = im.tell()
            name = file.split('.')[0]+'_' + childrenPicName + '_'+str(current)+'.png'
            # 保存图片
            im.save(name)
            # 下一帧
            im.seek(current+1)
    except:
        os.chdir(path)

## 若按照如下命令执行，则需要图片与程序放置在同一个目录下
gif2pic('caixukun.gif', '/caixukun', 'p')
```

## 函数解读

### Image.open(fp, mode='r', formats=None)

官方文档描述如下：

```
Opens and identifies the given image file.

This is a lazy operation; this function identifies the file, but the file remains open and the actual image data is not read from the file until you try to process the data (or call the load() method).
```

大概意思是：打开并标识给定的图片文件，并且是一个惰性操作，标记文件并保持打开状态，直到尝试处理数据时才读取实际的图像数据。

### Image.tell()

```
Returns the current frame number. See seek().

If defined, n_frames refers to the number of available frames.

RETURNS:
Frame number, starting with 0.
```

翻译过来就是范围当前的帧号，从0开始。

### Image.seek(frame)

```
Seeks to the given frame in this sequence file. If you seek beyond the end of the sequence, the method raises an EOFError exception. When a sequence file is opened, the library automatically seeks to frame 0.

See tell().

If defined, n_frames refers to the number of available frames.

PARAMETERS:
frame – Frame number, starting at 0.

RAISES:
EOFError – If the call attempts to seek beyond the end of the sequence.
```

翻译过来，大概意思是查找序列文件中的给定帧，超出序列末尾则会引发异常，如果一个打开一个序列文件，则自动指向第0帧。














