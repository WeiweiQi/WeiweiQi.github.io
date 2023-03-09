# Python制作动态字符图



## 预期效果

<div align='center'><image src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f01fc76ebed4207a3c7d802378a9f6a~tplv-k3u1fbpfcp-watermark.image?'></div>

<div align='center'><image src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b109e0c998564466a50133eb34fed66b~tplv-k3u1fbpfcp-watermark.image?'></div>

<div align='center'><image src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cecbdbd045274549976916f2c32dacda~tplv-k3u1fbpfcp-watermark.image?'></div>

如图所示，可以根据给定的静态图片或者静态图片，生成带色彩或者灰度的字符图。

若对实现思路处理方式感兴趣，可继续阅读。

## 思路

### 静态图

静态图，需要将图片的相关位置的像素转换为与之相似的字符。

### 动态图

动态图相比静态图是动态多帧的，但处理方式类似。

首先需要逐帧拆解动态图，将其拆分为多张静态图，按照静态图的方式逐帧处理，最后再合帧成动态图。

## 相关库

Python的Image库：[Pillow](https://pillow.readthedocs.io/en/stable/reference/Image.html)

可以[链接](https://pillow.readthedocs.io/en/stable/reference/Image.html)查看其各个模块的详细使用文档。

## 实现代码

完整代码贴在下面，或关注公众号，回复"字符图"可下载代码。

```python
# 注意执行的时候将原gif与python文件放在同一个目录下
import os
from PIL import Image, ImageDraw, ImageFont
import imageio

# 拆分 gif 将每一帧处理成字符画
def gif2pic(file, chDir, ascii_chars, isgray, font, scale):
    '''
    file: gif 文件
    chDir: 保存每一帧的文件夹路径
    ascii_chars: 灰度值对应的字符串
    isgray: 是否黑白
    font: ImageFont 对象
    scale: 缩放比例
    '''
    chDir = '/' + chDir + '/'
    im = Image.open(file)
    path = os.getcwd()
    if(not os.path.exists(path+chDir)):
        os.mkdir(path+chDir)
    os.chdir(path+chDir)
    # 清空chDir目录下内容
    for f in os.listdir(path+chDir):
        os.remove(f)
    try:
        while 1:
            current = im.tell()
            name = file.split('.')[0]+'_tmp_'+str(current)+'.png'
            # 保存每一帧图片
            im.save(name)
            # 将每一帧处理为字符画
            img2ascii(name, ascii_chars, isgray, font, scale)
            # 继续处理下一帧
            im.seek(current+1)
    except:
        os.chdir(path)

# 将不同的灰度值映射为 ASCII 字符
def get_char(ascii_chars, r, g, b):
    length = len(ascii_chars)
    gray = int(0.2126 * r + 0.7152 * g + 0.0722 * b)
    return ascii_chars[int(gray/(256/length))]


# 将图片处理成字符画
def img2ascii(img, ascii_chars, isgray, font, scale):
    scale = scale
    # 将图片转换为 RGB 模式
    im = Image.open(img).convert('RGB')
    # 设定处理后的字符画大小
    raw_width = int(im.width * scale)
    raw_height = int(im.height * scale)
    # 获取设定的字体的尺寸
    font_x, font_y = font.getsize(' ')
    # 确定单元的大小
    block_x = int(font_x * scale)
    block_y = int(font_y * scale)
    # 确定长宽各有几个单元
    w = int(raw_width/block_x)
    h = int(raw_height/block_y)
    # 将每个单元缩小为一个像素
    im = im.resize((w, h), Image.NEAREST)
    # txts 和 colors 分别存储对应块的 ASCII 字符和 RGB 值
    txts = []
    colors = []
    for i in range(h):
        line = ''
        lineColor = []
        for j in range(w):
            pixel = im.getpixel((j, i))
            lineColor.append((pixel[0], pixel[1], pixel[2]))
            line += get_char(ascii_chars, pixel[0], pixel[1], pixel[2])
        txts.append(line)
        colors.append(lineColor)
    # 创建新画布
    img_txt = Image.new('RGB', (raw_width, raw_height), (255, 255, 255))
    # 创建 ImageDraw 对象以写入 ASCII
    draw = ImageDraw.Draw(img_txt)
    for j in range(len(txts)):
        for i in range(len(txts[0])):
            if isgray:
                draw.text((i * block_x, j * block_y), txts[j][i], (119,136,153))
            else:
                draw.text((i * block_x, j * block_y), txts[j][i], colors[j][i])
    img_txt.save(img)

# 读取 tmp 目录下文件合成 gif
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
    imageio.mimsave(out_name + '字符.gif',images,duration = duration)

gif2pic('caixukun.gif', 't', 'MNHQ$OC67+>!:-. ', True, ImageFont.load_default(), 1)
pic2gif('t/', 'c6', 0.1)
```



