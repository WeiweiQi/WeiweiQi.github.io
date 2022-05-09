---
title: 机器学习实战笔记二——K近邻算法
comments: true
date: 2022-03-15 18:23:09
categories:
tags:
---

> 辅车相依，唇亡齿寒。————《左传·僖公五年》

## K近邻算法概述

K近邻算法采用测量不同特征值之间的距离方法进行分类。

具有精度高、对异常值不敏感、无数据输入假定，可以适用于数值型和标称型的优点，但是计算复杂度高、空间复杂度高。

## K近邻算法的工作原理

>  存在一个样本数据集合，也称作训练样本集，并且样本集中每个数据都存在标签，即我们知道样本集中每一数据与所属分类的对应关系。输入没有标签的新数据后，将新数据的每个特征与样本集中数据对应的特征进行比较，然后算法提取样本集中特征最相似数据（最近邻）的分类标签。一般来说，我们只选择样本数据集中前*k*个最相似的数据，这就是*k*-近邻算法中*k*的出处，通常*k*是不大于20的整数。最后，选择*k*个最相似数据中出现次数最多的分类，作为新数据的分类。

以电影分类为例，统计电影中的打斗镜头次数与接吻镜头次数作为特征值，计算所预测的电影与已知电影的距离，假定k=3，即选择三个“距离”最靠近的电影，根据这三个电影的类型决定未知电影的类型。

## K近邻算法的一般流程

(1) 收集数据：可以使用任何方法。 

(2) 准备数据：距离计算所需要的数值，最好是结构化的数据格式。 

(3) 分析数据：可以使用任何方法。 

(4) 训练算法：此步骤不适用于*k*-近邻算法。 

(5) 测试算法：计算错误率。

(6) 使用算法：首先需要输入样本数据和结构化的输出结果，然后运行*k*-近邻算法判定输入数据分别属于哪个分类，最后应用对计算出的分类执行后续的处理。

## 算法程序步骤

### 导入数据：创建数据集与标签

python程序如下：

```python
from numpy import *
import operator

def createDataSet():
    group = array([[1.0, 1.1], [1.0, 1.0], [0, 0], [0, 0.1]])
    labels = ['A', 'A', 'B', 'B']
    return group, labels
```

这里我们创建了两组数据，一组4行两列的`group`矩阵，表示我们已知的4组数据，每组数据包含两个特征；`labels`表示我们已知的数据标签，分别对应`group`中的4行数据。

## 执行kNN算法

kNN算法伪代码：

>对未知类别属性的数据集中的每个点依次执行以下操作：
>
>(1) 计算已知类别数据集中的点与当前点之间的距离；
>
>(2) 按照距离递增次序排序；
>
>(3) 选取与当前点距离最小的*k*个点；
>
>(4) 确定前*k*个点所在类别的出现频率；
>
>(5) 返回前*k*个点出现频率最高的类别作为当前点的预测分类。

其python程序源码以及代码解读如下：

```python
from numpy import *
import operator

def createDataSet():
    group = array([[1.0, 1.1], [1.0, 1.0], [0, 0], [0, 0.1]])
    labels = ['A', 'A', 'B', 'B']
    return group, labels


def classify0(inX, dataSet, labels, k):
    """
    :param inX: 预测分类的输入向量，比如[0, 0]
    :param dataSet: 训练样本集，比如[[1.0, 1.1], [1.0, 1.0], [0.0, 0.0], [0, 0.1]]
    :param labels: 标签向量 ['A', 'A', 'B', 'B']
    :param k: 选择最近邻居的数目，比如k=3
    :return: 预测的结果标签
    """
    dataSetSize = dataSet.shape[0] # dataSetSize = 4
    inXCopy = tile(inX, (dataSetSize, 1)) # 复制inX，结果为[[0, 0], [0, 0], [0, 0], [0, 0]]，为计算欧式距离做准备
    diffMat = inXCopy - dataSet # 坐标差: [[-1.,-1.1], [-1.0,-1.0], [ 0.0, 0.0], [ 0.0, -0.1]]
    sqDiffMat = diffMat**2 # 坐标差平方：[[1.   1.21], [1.   1.  ], [0.   0.  ], [0.   0.01]]
    sqDistances = sqDiffMat.sum(axis=1) # 按行求和：[2.21 2.   0.   0.01]
    distances = sqDistances**0.5 # 距离平方根，即欧式距离：[1.48660687 1.41421356 0.         0.1       ]
    sortedDistances = distances.argsort() # 数值从小到大的索引：[2 3 1 0], 即数组distance中实际顺序为[distance[2], distance[3], distance[1], distance[0]]
    # 下面4行代码计算距离数组中前k个元素的标签数量
    classCount = {} # 计算结果为：{'B': 2, 'A': 1}
    for i in range(k):
        # sortedDistances实际是labels中距inX从小到大次序的索引
        l = sortedDistances[i]
        voteIlabel = labels[l]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1

    # classCount.items() 结果：dict_items([('B', 2), ('A', 1)])
    # operator.itemgetter(1) 表示对字典数据第一个域进行排序
    sortedClassCount = sorted(classCount.items(), key=operator.itemgetter(1), reverse=True)
    # sortedClassCount最终计算结果：<class 'list'>: [('B', 2), ('A', 1)]
    return sortedClassCount[0][0]

group, labels = createDataSet()
r = classify0([0, 0], group, labels, 3)
print(r)
```



## 如何测试分类器

错误率：错误结果的次数除以测试执行的总数。

完美分类器的错误率为0，最差分类器的错误率是1.0。



