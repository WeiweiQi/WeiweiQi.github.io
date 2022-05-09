---
title: 机器学习实战笔记二——matplotlib绘图
comments: true
date: 2022-03-18 14:53:21
categories:
tags:
---



> 因人之力而敝之，不仁。失其所与，不知。以乱易整，不武。——古文观止 · 烛之武退秦师

在学习机器学习书籍时，一般都推荐python，matlab或者octave首先来做算法实现。

在Python中，涉及到一个非常好用的绘图库就是matplotlib。

今天我们来介绍一个matplotlib的基本操作。

## 基础演示

首先我们看一个基本的样例：

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.arange(1, 15)
y = 2 * x + 5
plt.title("demo")
plt.xlabel("x")
plt.ylabel("y")
plt.plot(x, y)
plt.show()
```

运行结果如下图所示：

![image-20220318151128220](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220318151128220.png)

上述代码是Matplotlib与numpy库一起使用的一个基础样例。

下面列举几个Matplotlib中常用的函数以及基础的使用样例。

## plot函数

plot函数调用有两种形式，我们可以通过help命令查看：

```python
plot([x], y, [fmt], data=None, **kwargs)
plot([x], y, [fmt], [x2], y2, [fmt2], ..., **kwargs)
```

其中中括号扩起来的部分表示可选参数。

其中, fmt表示线/点的样式，包括颜色，点型，线型。fmt = '[颜色] [点型] [线型]'，例如`plot(x, y, 'b+-')`表示绘制蓝色+号实线图，如下所示：

![image-20220318155042373](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220318155042373.png)

也可以按照如下代码编写：

```python
    plt.plot(x, y, color='blue', marker='+', linestyle='-')
```

这一句的效果与上面的`plot(x, y, 'b+-')`是一样的，其他可添加的属性还包括：

线条宽度：linewidth， 点标记大小：markersize，其他相关属性可参考：[line2D](https://matplotlib.org/3.3.2/api/_as_gen/matplotlib.lines.Line2D.html)



## subplot函数

见字知意，该函数表示向现有图形窗口中添加子图。来看示例：

```python
subplot(nrows, ncols, index, **kwargs)
```

其中的参数分别表示子图在整个图形窗口网格中的位置与索引。

如下代码所示：

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.arange(1, 15)
y = 1 * x + 5
y2 = 2 * x + 0
y3 = 5 * x + 0
y4 = 10 * x + 0
plt.subplot(2, 2, 1)
plt.xlim((0, 15))
plt.ylim((0, 150))
plt.title("y")
plt.plot(x, y)
plt.subplot(2, 2, 2)
plt.xlim((0, 15))
plt.ylim((0, 150))
plt.title("y2")
plt.plot(x, y2)
plt.subplot(2, 2, 3)
plt.xlim((0, 15))
plt.ylim((0, 150))
plt.title("y3")
plt.plot(x, y3)
plt.subplot(2, 2, 4)
plt.xlim((0, 15))
plt.ylim((0, 150))
plt.title("y4")
plt.plot(x, y4)
plt.show()

```

输出结果如下所示：



![image-20220318164444557](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220318164444557.png)

其中，可以看到，通过nrows与ncols将整个视窗划分为`nrows*ncols`的网格，然后通过`index`按照从左到右，从上到下的次序依次补充图形。当然，图形并不总是相同的，还可以进行如下的绘制：

![image-20220318165228992](https://gitee.com/wieweicoding/kevinqimgs/raw/master/img/image-20220318165228992.png)

## scatter 散点图

```python
matplotlib.pyplot.scatter(x, y, s=None, c=None, marker=None, cmap=None, norm=None, vmin=None, vmax=None, alpha=None, linewidths=None, *, edgecolors=None, plotnonfinite=False, data=None, **kwargs)
```

这个函数需要引起重视，为什么呢？

因为在机器学习中，我们常常需要查看原始数据的分布情况，得出一个初步的结论，这是就会用到散点图了。

散点图scatter各个参数的具体含义可以参考[链接](https://www.runoob.com/matplotlib/matplotlib-scatter.html)。

## 其他常用函数：



| 函数       | 含义   |
| ---------- | ------ |
| pyplot.bar | 柱状图 |
| pyplot.pie | 饼图   |
|            |        |



