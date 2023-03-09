# Python3 彩色图片转字符图

## 实现的最终效果

我们想要实现的一种如下所示的效果：

输入的原图

![happy.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd988506aa0a4c359f3a6c4474c5ac78~tplv-k3u1fbpfcp-watermark.image?)

输出的效果图（由字符构成的图）

![微信截图_20230201184917.png](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/7c353b77331c46b9855ca9c626cc50a1~tplv-k3u1fbpfcp-watermark.image)

我们来看看如何通过Python的PIL库来实现。

## 具体实现代码

```python
from PIL import Image, ImageDraw, ImageFont

# 将图片处理成字符画
def img2ascii(img, outName, ascii_chars, isgray, font, scale):
    # 将图片转换为 RGB 模式
    im = Image.open(img).convert('RGB')
    # 设定处理后的字符画大小
    print(im.width)
    print(im.height)
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
            # 获取RGB的值，pixel格式[R, G, B]
            pixel = im.getpixel((j, i))
            lineColor.append((pixel[0], pixel[1], pixel[2]))
            # 根据该点的RGB值，将其转换成对应的字符
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
                # 可以去https://www.sioe.cn/yingyong/yanse-rgb-16/ 查一下(119,136,153)是什么颜色的
                draw.text((i * block_x, j * block_y), txts[j][i], (119,136,153))
            else:
                draw.text((i * block_x, j * block_y), txts[j][i], colors[j][i])
    img_txt.save(outName)

# 将不同的灰度值映射为 ASCII 字符
def get_char(ascii_chars, r, g, b):
    length = len(ascii_chars)
    # 对于 sRGB 色彩空间，一种颜色的相对亮度定义为：
    # L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    gray = int(0.2126 * r + 0.7152 * g + 0.0722 * b)
    # gray在0-255之间，因此gray/256 * length 肯定是介于 [0, length - 1]之间
    return ascii_chars[int(gray/(256/length))]

img2ascii('happy.jpg', 'after_happy.jpg', 'MNHQ$OC67+>!:-. ', True, ImageFont.load_default(), 1)
```

## 相关库

Python的Image库：[Pillow](https://pillow.readthedocs.io/en/stable/reference/Image.html)

可以[链接](https://pillow.readthedocs.io/en/stable/reference/Image.html)查看其各个模块的详细使用文档，该程序使用的主要是以下几个方法`Image.open`，`Image.convert`，`Image.resize`，`Image.new`，`ImageDraw.Draw`，`image.save`。

## 代码解读

首先通过`Image.open`读原图，并通过`Image.convert`将其转换为RGB模式。convert函数支持的具体模式列表可参考[官方文档](https://pillow.readthedocs.io/en/stable/handbook/concepts.html#concept-modes)。

官方文档中对于L模式(8-bit pixels, black and white)与RGB模式的转换公式如下：

```
L = R * 299/1000 + G * 587/1000 + B * 114/1000
```

所以，如果我们不采用sRGB也可以尝试一下通过这种方式来将RGB转换为亮度，即上文代码中的`get_char`函数中的`gray`的计算方式。

获取图片后，紧接着获取图片的宽高，并根据`scale`值计算处理后图的宽高，并原图按照处理后的宽高进行缩放，即`resize`，第二个参数为缩放过程的取样方式，`Image.NEAREST`即取距离最近的像素而忽略其他的输入像素，其他可取的值还有`Image.BOX`等等，具体可以参考[文档](https://pillow.readthedocs.io/en/stable/handbook/concepts.html#concept-filters)。

然后通过`txts`存储像素转换之后的字符，`colors`存储像素转换后的颜色。

最终，通过ImageDraw逐个字符的写入并保存。



